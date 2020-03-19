<?php
/**
 * The controller for all Crud functions of the User entity.
 */

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * Class UserController
 * @package App\Controller
 */
class UserController extends AbstractController
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
     * Requires mail and password in json format.
     *
     * @Route("/user", name="user_create", methods={"POST"})
     *
     * @param Request $request
     * @return Response
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function createUser(Request $request)
    {
        $data = json_decode($request->getContent());
        if (!isset($data->email) || !isset($data->password)) {
            $error = [
                "error" => "Missing required parameters",
                "email" => isset($data->email),
                "password" => isset($data->password)];
            return new Response(json_encode($error), Response::HTTP_BAD_REQUEST);
        }
        if ($this->repository->findBy(['email' => $data->email])) {
            $error = [
                "error" => "An account already exists with this email address",
                "email" => isset($data->email),
                "password" => isset($data->password)];
            return new Response(json_encode($error), Response::HTTP_CONFLICT);
        }

        $user = new User();
        $user->setEmail($data->email);
        $encodedPassword = $this->encoder->encodePassword($user, $data->password);
        $user->setPassword($encodedPassword);
        $user->setExpires(false);
        $this->em->persist($user);
        $this->em->flush();

        $response = $this->serializer->serialize($user, "json");
        return new Response($response, Response::HTTP_CREATED);
    }

    /**
     * Method for updating a user.
     * Requires id in in url.
     * Optional email, password and phone.
     *
     * @Route("/user/{id}", name="user_update", methods={"PATCH"})
     *
     * @param Request $request
     * @param $id
     * @return Response
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function updateUser(Request $request, $id = 0)
    {
        $requestData = json_decode($request->getContent());
        if (!isset($id)) {
            $error = [
                "error" => "Missing required parameters",
                "id" => isset($id)];
            return new Response(json_encode($error), Response::HTTP_BAD_REQUEST);
        }
        /** @var User $user */
        $user = $this->repository->find($id);
        if (!$user) {
            $error = [
                "error" => "No account found with this id",
                "id" => isset($id)];
            return new Response(json_encode($error), Response::HTTP_BAD_REQUEST);
        }

        if (isset($requestData->email)) $user->setEmail($requestData->email);
        if (isset($requestData->password)) $user->setPassword($this->encoder->encodePassword($user, $requestData->password));
        if (isset($requestData->phone)) $user->setPhone($requestData->phone);
        $this->em->flush();

        $response = $this->serializer->serialize($user, "json");
        return new Response($response, Response::HTTP_OK);
    }

    /**
     * Method for disabling or enabling a user.
     * Requires id in url.
     *
     * @Route("/user/active/{id}", name="user_active", methods={"PATCH"})
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
            $error = [
                "error" => "Missing required parameters",
                "id" => $id
            ];
            return new Response(json_encode($error), Response::HTTP_BAD_REQUEST);
        }
        $user = $this->repository->find($id);
        if (!$user) {
            $error = [
                "error" => "No account found with this id",
                "id" => $id
            ];
            return new Response(json_encode($error), Response::HTTP_BAD_REQUEST);
        }

        $user->setActive(!$user->getActive());
        $this->em->flush();

        $response = $this->serializer->serialize($user, "json");
        return new Response($response, Response::HTTP_OK);
    }

    /**
     * Method for retrieving one or more users.
     * Optional parameters as filter.
     * When no parameters are given all users wil ben retrieved from the database.
     *
     * @Route("/user/{id}", name="user_get", methods={"GET","HEAD"})
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
        if (!$users) return new Response(null, Response::HTTP_NOT_FOUND);

        $response = $this->serializer->serialize($users, 'json');
        return new Response($response, Response::HTTP_OK);
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
            $error = [
                "error" => "Missing required parameters",
                "id" => isset($id),
                "role" => isset($requestData->role)
            ];
            return new Response(json_encode($error), Response::HTTP_BAD_REQUEST);
        }
        if ($requestData->role != "ROLE_PENNINGMEESTER" && $requestData->role && "ROLE_BEHEERDER" && $requestData->role != "ROLE_USER") {
            $error = [
                "error" => "Role parameter must be 'ROLE_PENNINGMEESTER', 'ROLE_BEHEERDER' or 'ROLE_USER'",
                "id" => isset($id),
                "role" => isset($requestData->role)
            ];
            return new Response(json_encode($error), Response::HTTP_BAD_REQUEST);
        }
        $user = $this->repository->find($id);
        if (!$user) {
            $error = [
                "error" => "No account found with this id",
                "id" => isset($id),
                "role" => isset($requestData->role)
            ];
            return new Response(json_encode($error), Response::HTTP_BAD_REQUEST);
        }

        $user->setRoles(["$requestData->role"]);
        $this->em->flush();

        $response = $this->serializer->serialize($user, 'json');
        return new Response($response, Response::HTTP_OK);
    }

    /**
     * Method for deleting a user entity.
     * Requires id in json format.
     *
     * @Route("/user/{id}", name="user_delete", methods={"DELETE"})
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
            $error = [
                "error" => "Missing required parameters",
                "id" => isset($id)
            ];
            return new Response(json_encode($error), Response::HTTP_BAD_REQUEST);
        }
        $user = $this->repository->find($id);
        if (!$user) {
            $error = [
                "error" => "No account found with this id",
                "id" => isset($id)
            ];
            return new Response(json_encode($error), Response::HTTP_BAD_REQUEST);
        }

        $this->em->remove($user);
        $this->em->flush();

        $response = $this->serializer->serialize($user, 'json');
        return new Response($response, Response::HTTP_OK);
    }
}
