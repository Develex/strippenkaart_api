<?php

namespace App\Controller\API;

use App\Entity\Stripcard;
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
     * @Route("/auth/login", name="login", methods={"POST"})
     *
     * @return Response
     */
    public function login(): Response
    {
        return $this->sendError(400, "Missing Credentials in HTTP Basic");
    }

    /**
     * @Route("/auth/register", name="register", methods={"POST"})
     *
     * @param Request $request
     * @param \Swift_Mailer $swiftMailer
     * @return Response
     * @throws \Exception
     */
    public function register(Request $request, \Swift_Mailer $swiftMailer): Response
    {
        if ($request)
            $data = json_decode($request->getContent());
        if ($data->email == "" || $data->password == "") {
            return $this->sendError(400, "Missing required parameters");
        }
        if ($this->repository->findBy(['email' => $data->email])) {
            return $this->sendError(409, "Email address is already taken.");
        }

        $code = $this->random_str(16);

        $user = new User();
        $user->setEmail($data->email);
        $encodedPassword = $this->encoder->encodePassword($user, $data->password);
        $user->setPassword($encodedPassword);
        $user->setExpires(true);
        $user->setVerificationCode($code);

        $stripcard = new Stripcard();
        $user->setStrippen($stripcard);

//        return $this->sendResponse(222, [$user, $stripcard]);

        $this->em->persist($stripcard);
        $this->em->persist($user);
        $this->em->flush();

        $this->sendMail($data->email, ['code' => $code], $swiftMailer);

        return $this->sendResponse(200, "Account created.");
    }

    /**
     * Generate a random string, using a cryptographically secure
     * pseudorandom number generator (random_int)
     *
     * This function uses type hints now (PHP 7+ only), but it was originally
     * written for PHP 5 as well.
     *
     * For PHP 7, random_int is a PHP core function
     * For PHP 5.x, depends on https://github.com/paragonie/random_compat
     *
     * @author https://stackoverflow.com/a/31107425
     *
     * @param int $length How many characters do we want?
     * @param string $keyspace A string of all possible characters
     *                         to select from
     * @return string
     * @throws \Exception
     */
    function random_str(
        int $length = 8,
        string $keyspace = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    ): string
    {
        if ($length < 1) {
            throw new \RangeException("Length must be a positive integer");
        }
        $pieces = [];
        $max = mb_strlen($keyspace, '8bit') - 1;
        for ($i = 0; $i < $length; ++$i) {
            $pieces [] = $keyspace[random_int(0, $max)];
        }
        return implode('', $pieces);
    }

    /**
     * Method for confirming a email of a account
     *
     * requires verification code in GET.
     * TODO when user is verified redirect to Front-end Page.
     *
     *
     * Heb de method van POST naar GET tijdelijk veranderd voor testing.
     * @Route("/auth/confirm", name="confirm", methods={"GET"})
     *
     * @param Request $request
     */
    public function confirm(Request $request)
    {
        $data = $request->query->all();
        $user = $this->em->getRepository(User::class)->findOneBy(['verificationCode' => $data['c']]);
        if (!$user)
            dd("no user found");
        else {
            $user->setVerified(true);
            $user->setActive(true);
            $this->em->flush();
            return $this->render('landing/index.html.twig');
        }
    }

    /**
     * Method voor het activeren van een account.
     * @Route("/auth/{id}/activate", name="activate", methods={"POST"})
     *
     * @param Request $request
     * @param $id
     */
    public function activate(Request $request, $id)
    {
        $user = $this->em->getRepository(User::class)->find($id);
        if (!$user)
            $this->sendError(400, "User not found");
        else {
            $user->setActive(true);
            $this->em->flush();
        }
        return $this->sendResponse(200, "Account updated");
    }

    /**
     * Method voor het uitloggen en accesstoken te invalideren.
     * @Route("/auth/logout", name="api_logout", methods={"POST"})
     */
    public function logout()
    {
        throw new \Exception("If you see this, something is bad happened");
    }
}
