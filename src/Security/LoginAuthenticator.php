<?php

namespace App\Security;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Guard\AbstractGuardAuthenticator;

/**
 * Class LoginAuthenticator
 * @package App\Security
 * @author Collin Franckena <collin.franckena001@fclive.nl> <collinfranckena77@gmail.com>, Crebo: 15187 , Friesland College Heereveen, Studentnumber:227398.
 * @version 1.0
 */
class LoginAuthenticator extends AbstractGuardAuthenticator
{
    /**
     * @var EntityManagerInterface
     */
    private $em;
    /**
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    /**
     * AccessTokenAuthenticator constructor.
     * @param EntityManagerInterface $entityManager
     * @param UserPasswordEncoderInterface $encoder
     */
    public function __construct(EntityManagerInterface $entityManager, UserPasswordEncoderInterface $encoder)
    {
        $this->em = $entityManager;
        $this->encoder = $encoder;
    }

    /**
     * @param Request $request
     * @return bool
     */
    public function supports(Request $request)
    {
        if (($request->getPathInfo() == '/api/v1/login' || $request->isMethod('POST')) &&
            ($request->headers->has('Authorization') && 0 === strpos($request->headers->get('Authorization'), 'Basic '))) {
            return true;
        };
        return false;
    }

    /**
     * @param Request $request
     * @return false|mixed|string
     */
    public function getCredentials(Request $request)
    {
        $authorizationHeader = $request->headers->get('Authorization');

        return substr($authorizationHeader, 6);
    }

    /**
     * @param mixed $credentials
     * @param UserProviderInterface $userProvider
     * @return User|object|UserInterface|null
     */
    public function getUser($credentials, UserProviderInterface $userProvider)
    {
        if (null === $credentials) {
            return null;
        }
        $decodedCredentials = base64_decode($credentials);
        $arrayCredentials = explode(':', $decodedCredentials);
        return $this->em->getRepository(User::class)->findOneBy(['email' => $arrayCredentials[0]]);
    }

    /**
     * @param mixed $credentials
     * @param UserInterface $user
     * @return bool|void
     */
    public function checkCredentials($credentials, UserInterface $user)
    {
        $decodedCredentials = base64_decode($credentials);
        $arrayCredentials = explode(':', $decodedCredentials);
        return $this->encoder->isPasswordValid($user, $arrayCredentials[1]);
        //return false|true;
    }

    /**
     * @param Request $request
     * @param AuthenticationException $exception
     * @return Response|null
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        $msg = [
            "message" => "Wrong Credentials"
        ];

        return new Response(json_encode($msg), Response::HTTP_UNAUTHORIZED);
    }

    /**
     * @param Request $request
     * @param TokenInterface $token
     * @param string $providerKey
     * @return Response|null
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, $providerKey)
    {
        /** @var string $accessToken */
        $accessToken = null;
//
//        $user = $token->getUser();
//

        $msg = [
            "message" => "Login Successful",
            "access_token" => $accessToken
        ];
        return new Response(json_encode($msg), Response::HTTP_CREATED);
//        return null;
    }

    /**
     * @param Request $request
     * @param AuthenticationException|null $authException
     * @return Response
     */
    public function start(Request $request, AuthenticationException $authException = null)
    {
        $msg = [
            "message" => "Authentication Required"
        ];

        return new Response(json_encode($msg), Response::HTTP_UNAUTHORIZED);
    }

    /**
     * @return bool
     */
    public function supportsRememberMe()
    {
        return false;
    }
}
