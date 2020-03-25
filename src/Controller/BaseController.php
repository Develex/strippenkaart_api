<?php


namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

/*
 * Class BaseController
 * @package App\Controller
 * @author Collin Franckena <collin.franckena001@fclive.nl> <collinfranckena77@gmail.com>, Crebo: 15187 , Friesland College Heereveen, Student number:227398.
 * @version 1.0
 */

class BaseController extends AbstractController
{
    /**
     * @param integer $code
     * @param array|string|null $data
     * @return Response
     */
    public function sendResponse($code, $data): Response
    {
        $msg = [
            "status" => "action was successful",
            "code" => $code,
            "data" => $data,
            "access_token" => $this->getUser()->getAccessToken()
        ];

        return new Response(json_encode($msg), $code);
    }


    /**
     * @param integer $code
     * @param array|string|null $data
     * @return Response
     */
    public function sendError($code, $data): Response
    {
        $msg = [
            "status" => "action has failed",
            "code" => $code,
            "message" => $data,
            "access_token" => $this->getUser()->getAccessToken()
        ];

        return new Response(json_encode($msg), $code);

    }
}