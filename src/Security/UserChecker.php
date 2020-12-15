<?php


namespace App\Security;


use App\Entity\User;
use Symfony\Component\Security\Core\Exception\AccountExpiredException;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserCheckerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class UserChecker implements UserCheckerInterface
{

    /**
     * @inheritDoc
     */
    public function checkPreAuth(UserInterface $user)
    {
        if (!$user instanceof User) {
            return;
        }

        // Check if the User is verified.
        if (!$user->getVerified()) {
            throw new AccountExpiredException("Account met het email '" . $user->getEmail() . "' niet geverifieerd. Check uw mail en probeer opnieuw");
        }

        // Check if the user is active
        if ($user->isInactive()) {
            throw new AuthenticationException("Account niet gevonden");
        }
    }

    /**
     * @inheritDoc
     */
    public function checkPostAuth(UserInterface $user)
    {
        if (!$user instanceof User) {
            return;
        }


    }
}