<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

/**
 * Class SecurityController
 * @package App\Controller
 * @author Collin Franckena <collin.franckena001@fclive.nl> <collinfranckena77@gmail.com>, Crebo: 15187 , Friesland College Heereveen, Student number:227398.
 * @version 1.0
 */
class SecurityController extends BaseController
{
    /**
     * @var UserRepository
     */
    private $repository;
    /**
     * @var EntityManagerInterface
     */
    private $em;
    /**
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    /**
     * SecurityController constructor.
     * @param UserRepository $repository
     * @param EntityManagerInterface $entityManager
     * @param UserPasswordEncoderInterface $encoder
     */
    public function __construct(UserRepository $repository, EntityManagerInterface $entityManager, UserPasswordEncoderInterface $encoder)
    {
        $this->repository = $repository;
        $this->em = $entityManager;
        $this->encoder = $encoder;
    }

    /**
     * @Route("/login", name="login", methods={"POST"})
     *
     * @return Response
     */
    public function login(): Response
    {
        return $this->sendError(400, "Missing Credentials in HTTP Basic");
    }

    /**
     * @Route("/register", name="register", methods={"POST"})
     *
     * @param Request $request
     * @return Response
     */
    public function register(Request $request): Response
    {
        if ($request)
            $data = json_decode($request->getContent());
        if (!isset($data->email) || !isset($data->password)) {
            return $this->sendError(400, "Missing required parameters");
        }
        if ($this->repository->findBy(['email' => $data->email])) {
            return $this->sendError(409, "Email address is already taken.");
        }

        $user = new User();
        $user->setEmail($data->email);
        $encodedPassword = $this->encoder->encodePassword($user, $data->password);
        $user->setPassword($encodedPassword);
        $user->setExpires(true);
        $this->em->persist($user);
        $this->em->flush();

        return $this->sendResponse(200, "Account created.");
    }

    /**
     * Method for confirming a email of a account
     *
     * requires reference of account in body of the request.
     *
     * @Route("/confirm", name="confirm", methods={"POST"})
     *
     * @param Request $request
     * @return Response
     */
    public function confirm(Request $request): Response
    {
        $token = null;
        

    }
}
