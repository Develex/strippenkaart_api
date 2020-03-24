<?php


namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

/**\
 * Class BaseController
 * @package App\Controller
 * @author Collin Franckena <collin.franckena001@fclive.nl> <collinfranckena77@gmail.com>, Crebo: 15187 , Friesland College Heereveen, Student number:227398.
 * @version 1.0
 */
class BaseController extends AbstractController
{
    /**
     * @param $data
     * @param $message
     * @return Response
     */
    public function sendResponse($data, $message): Response
    {
        $msg = [
            "status" => "action was successful",
            "data" => $data,
            "message" => $message
        ];

        return new Response(json_encode($msg), Response::HTTP_OK);
    }

    /**
     * @param $data
     * @param $message
     * @return Response
     */
    public function sendError($data, $message): Response
    {
        $msg = [
            "status" => "action has failed",
            "data" => $data,
            "message" => $message
        ];

        return new Response(json_encode($msg), Response::HTTP_BAD_REQUEST);
    }
}