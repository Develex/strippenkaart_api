<?php


namespace App\Controller\API;

use Swift_Message;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class BaseController
 * @package App\Controller
 * @author Collin Franckena <collin.franckena001@fclive.nl> <collinfranckena77@gmail.com>, Crebo: 15187 , Friesland College Heereveen, Student number:227398.
 * @version 1.0
 */
class BaseController extends AbstractController
{
    private $swift_mailer;

    public function __construct(\Swift_Mailer $swift_Mailer)
    {
        $this->swift_mailer = $swift_Mailer;
    }

    /**
     * @param integer $code
     * @param array|string|null $data
     * @return Response
     */
    public function sendResponse($code, $data): Response
    {
        if ($this->getUser() == null) {
            $accessToken = null;
        } else {
            $accessToken = $this->getUser()->getAccessToken();
        }

        $msg = [
            "status" => "action was successful",
            "code" => $code,
            "data" => $data,
            "access_token" => $accessToken
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
        if ($this->getUser() == null) {
            $accessToken = null;
        } else {
            $accessToken = $this->getUser()->getAccessToken();
        }

        $msg = [
            "status" => "action has failed",
            "code" => $code,
            "message" => $data,
            "access_token" => $accessToken
        ];

        return new Response(json_encode($msg), $code);

    }

    /**
     * Sends a mail.
     *
     * uses the Gmail services.
     * can be changed to different service in the .env file.
     *
     * @param $email String Email Adress of the recipient.
     * @param $data
     * @param \Swift_Mailer $swiftMailer
     * @return bool status of the mailer.
     */
    public function sendMail($email, $data, \Swift_Mailer $swiftMailer)
    {
        $message = (new Swift_Message("Verfication Email"))
            ->setFrom('mailer@collinfranckena.com')
            ->setTo($email)
            ->setBody(
                $this->renderView(
                    'emails/register.html.twig',
                    [
                        'email' => $email,
                        'data' => $data
                    ]
                ),
                'text/html'
            );

        $swiftMailer->send($message);

        return $status = "failed";
    }
}