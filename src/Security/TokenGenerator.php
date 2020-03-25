<?php


namespace App\Entity;

use Exception;

/**
 * Class TokenGenerator
 *
 * Generates a bearer token.
 *
 * @package App\Entity
 * @author Collin Franckena <collin.franckena001@fclive.nl> <collinfranckena77@gmail.com>, Crebo: 15187 , Friesland College Heereveen, Studentnumber:227398.
 * @version 1.0
 */
class TokenGenerator
{
    /**
     * @param integer $size Size of the token to be generated
     * @return Exception|string|boolean
     */
    public function generate($size)
    {
        if (gettype($size) !== 'integer') {
            return false;
        }

        try {
            return strtr(base64_encode(random_bytes($size)), '+/', '-_');
        } catch (Exception $e) {
            return false;
        }
    }
}