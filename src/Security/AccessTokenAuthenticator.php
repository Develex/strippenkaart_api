<?php

namespace App\Security;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Guard\AbstractGuardAuthenticator;

/**
 * Class AccessTokenAuthenticator
 * @package App\Security
 * @author Collin Franckena <collin.franckena001@fclive.nl> <collinfranckena77@gmail.com>, Crebo: 15187 , Friesland College Heereveen, Studentnumber:227398.
 * @version 1.0
 */
class AccessTokenAuthenticator extends AbstractGuardAuthenticator
{
    /**
     * @var EntityManagerInterface
     */
    private $em;

    /**
     * AccessTokenAuthenticator constructor.
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->em = $entityManager;
    }

    /**
     * @param Request $request
     * @return bool
     */
    public function supports(Request $request)
    {
        return $request->headers->has('Authorization') &&
            0 === strpos($request->headers->get('Authorization'), 'Bearer ');
    }

    /**
     * @param Request $request
     * @return mixed|string|null
     */
    public function getCredentials(Request $request)
    {
        $authorizationHeader = $request->headers->get('Authorization');
        return substr($authorizationHeader, 7);
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

        return $this->em->getRepository(User::class)->findOneBy(['accessToken' => $credentials]);
    }

    /**
     * @param mixed $credentials
     * @param UserInterface $user
     * @return bool|null
     */
    public function checkCredentials($credentials, UserInterface $user)
    {
        // kan mogelijk hier checken als de token nog valide is.
        return true;
    }

    /**
     * @param Request $request
     * @param AuthenticationException $exception
     * @return Response|null
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        $msg = [
            "message" => "Login verlopen, Log opnieuw in."
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
        // mogelijke locatie voor accesstoken renewal
        return null;
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
