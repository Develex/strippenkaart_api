<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
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
     * UserController constructor.
     * @param EntityManagerInterface $entityManager
     * @param UserRepository $repository
     * @param SerializerInterface $serializer
     */
    public function __construct(EntityManagerInterface $entityManager, UserRepository $repository, SerializerInterface $serializer)
    {
        $this->em = $entityManager;
        $this->repository = $repository;
        $this->serializer = $serializer;
    }

    /**
     * @Route("/user", name="user_create", methods={"POST"})
     *
     * @param Request $request
     * @return Response
     */
    public
    function createUser(Request $request)
    {
        if (!$request->query->has('mail') && !$request->query->has('password')) {
            $error = ["error" => "Missing required parameters"];
            return new Response(json_encode($error), Response::HTTP_BAD_REQUEST);
        }


        return new Response("POST", Response::HTTP_OK);
    }

    /**
     * @Route("/user", name="user_update", methods={"PUT","PATCH"})
     *
     * @param Request $request
     * @return Response
     */
    public
    function updateUser(Request $request)
    {
        return new Response("PUT", Response::HTTP_OK);
    }

    /**
     * @Route("/user", name="user_delete", methods={"DELETE"})
     *
     * @param Request $request
     * @return Response
     */
    public
    function disableUser(Request $request)
    {
        return new Response("DELETE", Response::HTTP_OK);
    }

    /**
     * @Route("/user", name="user_get", methods={"GET"})
     *
     * @param Request $request
     * @return Response
     */
    public
    function getUsers(Request $request)
    {
        $users = $this->repository->findAll();

        return new Response(json_encode($users), Response::HTTP_OK);
    }
}
