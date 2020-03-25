<?php
/**
 * The controller for all Crud functions of the User entity.
 *
 *
 */

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * Class UserController.
 * This is the controller that handles all Crud routes of the User Entity.
 *
 * @package App\Controller
 * @author Collin Franckena <collin.franckena001@fclive.nl> <collinfranckena77@gmail.com>, Crebo: 15187 , Friesland College Heereveen, Student number:227398.
 * @version 1.0
 */
class UserController extends BaseController
{
    /**
     * @var EntityManager
     */
    private $em;

    /**
     * @var UserRepository
     */
    private $repository;

    /**
     * @var SerializerInterface
     */
    private $serializer;

    /**
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    /**
     * UserController constructor.
     * @param EntityManagerInterface $entityManager
     * @param UserRepository $repository
     * @param SerializerInterface $serializer
     * @param UserPasswordEncoderInterface $passwordEncoder
     */
    public function __construct(EntityManagerInterface $entityManager, UserRepository $repository, SerializerInterface $serializer, UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->em = $entityManager;
        $this->repository = $repository;
        $this->serializer = $serializer;
        $this->encoder = $passwordEncoder;
    }

    /**
     * Method for creating a new user.
     *
     * @Route("/user", name="user_create", methods={"POST"})
     * @IsGranted("ROLE_PENNINGMEESTER")
     *
     * @param Request $request email & password in the body.
     * @return Response
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function createUser(Request $request)
    {
        $data = json_decode($request->getContent());
        if (!isset($data->email) || !isset($data->password)) {
            return $this->sendError(400, "Missing required parameters");
        }
        if ($this->repository->findBy(['email' => $data->email])) {
            return $this->sendError(409, "An Account already exist with this email address");
        }

        $user = new User();
        $user->setEmail($data->email);
        $encodedPassword = $this->encoder->encodePassword($user, $data->password);
        $user->setPassword($encodedPassword);
        $user->setExpires(false);
        $this->em->persist($user);
        $this->em->flush();

        $response = $this->serializer->serialize($user, "json");
        return $this->sendResponse(201, $response);
    }

    /**
     * Method for updating a user.
     * Requires id in in url.
     * Optional email, password and phone.
     *
     * @Route("/user/{id}", name="user_update", methods={"PATCH"})
     * @IsGranted("ROLE_USER")
     *
     * @param Request $request email, username, phone in body of request.
     * @param integer $id id of the User entity that with be updated.
     * @return Response
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function updateUser(Request $request, $id)
    {
        $requestData = json_decode($request->getContent());
        if (!isset($id)) {
            return $this->sendError(400, "Missing required parameters");
        }
        $user = $this->repository->find($id);
        if (!$user) {
            return $this->sendError(204, "No user found with this id");
        }

        if (isset($requestData->email)) $user->setEmail($requestData->email);
        if (isset($requestData->password)) $user->setPassword($this->encoder->encodePassword($user, $requestData->password));
        if (isset($requestData->phone)) $user->setPhone($requestData->phone);
        $this->em->flush();

        return $this->sendResponse(200, "User successfully updated");
    }

    /**
     * Method for disabling or enabling a user.
     * Requires id in url.
     *
     * @Route("/user/active/{id}", name="user_active", methods={"PATCH"})
     * @IsGranted("ROLE_PENNINGMEESTER")
     *
     * @param Request $request
     * @param $id
     * @return Response
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function toggleActive(Request $request, $id = 0)
    {
        $requestData = json_decode($request->getContent());
        if ($id == 0) {
            return $this->sendError(400, "Missing required parameters");
        }
        $user = $this->repository->find($id);
        if (!$user) {
            return $this->sendError(204, "No user found with this id");
        }

        $user->setActive(!$user->getActive());
        $this->em->flush();

        return $this->sendResponse(200, "Successfully toggled user activation");
    }

    /**
     * Method for retrieving one or more users.
     * Optional parameters as filter.
     * When no parameters are given all users wil ben retrieved from the database.
     *
     * @Route("/user/{id}", name="user_get", methods={"GET","HEAD"})
     * @IsGranted("ROLE_USER")
     *
     * @param Request $request
     * @param $id
     * @return Response
     */
    public function getUsers(Request $request, $id = 0)
    {
        if ($id == 0) {
            $users = $this->repository->findBy($request->query->all());
        } else {
            $query = $request->query->all();
            $query['id'] = $id;
            $users = $this->repository->findby($query);
        }
        if (!$users) return $this->sendError(204, "No User(s) found");

        return $this->sendResponse(200, $users);
    }

    /**
     * Method for changing a users role.
     * Requires the following parameters in json format.
     * -role: needs one of the following -> An empty string for ROLE_USER, "ROLE_BEHEERDER", "ROLE_PENNINGMEESTER".
     *
     * @Route("/user/roles/{id}", name="user_role", methods={"PATCH"})
     *
     * @param Request $request
     * @param $id
     * @return Response
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function changeRole(Request $request, $id)
    {
        $requestData = json_decode($request->getContent());
        if (!isset($id) || !isset($requestData->role)) {
            return $this->sendError(400, "Missing required parameters");
        }
        if ($requestData->role != "ROLE_PENNINGMEESTER" && $requestData->role && "ROLE_BEHEERDER" && $requestData->role != "ROLE_USER") {
            return $this->sendError(400, "Role parameter must be 'ROLE_PENNINGMEESTER', 'ROLE_BEHEERDER' or 'ROLE_USER'");
        }
        $user = $this->repository->find($id);
        if (!$user) {
            return $this->sendError(400, "No account found with this id");
        }

        $user->setRoles(["$requestData->role"]);
        $this->em->flush();

//        $response = $this->serializer->serialize($user, 'json');
        return $this->sendResponse(200, $user);
    }

    /**
     * Method for deleting a user entity.
     * Requires id in json format.
     *
     * @Route("/user/{id}", name="user_delete", methods={"DELETE"})
     * @IsGranted("ROLE_PENNINGMEESTER")
     *
     * @param Request $request
     * @param $id
     * @return Response
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function deleteUser(Request $request, $id)
    {
        $requestData = json_decode($request->getContent());
        if (!isset($id)) {
            return $this->sendError(400, "Missing required parameters");
        }
        $user = $this->repository->find($id);
        if (!$user) {
            return $this->sendError(400, "No account found with this id");
        }

        $this->em->remove($user);
        $this->em->flush();

        return $this->sendResponse(200, "User Deleted");
    }
}
