<?php


namespace App\Controller\API;

use Mailer;
use Swift_Message;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

/**
 * Class BaseController
 * @package App\Controller
 * @author Collin Franckena <collin.franckena001@fclive.nl> <collinfranckena77@gmail.com>, Crebo: 15187 , Friesland College Heereveen, Student number:227398.
 * @version 1.0
 */
class BaseController extends AbstractController
{
    private $mailer;

    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
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
     * @param MailerInterface $mailer
     * @return bool status of the mailer.
     */
    public function sendMail($email, $data, MailerInterface $mailer)
    {
        $email = (new Email())
            ->from("strippenkaart@delta.icthv.nl")
            ->to($email)
            ->subject("Verificatie Registratie")
            ->html($this->renderView(
                'emails/register.html.twig',
                [
                    'email' => $email,
                    'data' => $data
                ]
            ));
        try {
            $mailer->send($email);
        } catch (TransportExceptionInterface $e) {
            $this->sendError(500, $e->getDebug());
            // some error prevented the email sending; display an
            // error message or try to resend the message
        }
    }
}