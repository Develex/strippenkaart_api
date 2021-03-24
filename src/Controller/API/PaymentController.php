<?php

namespace App\Controller\API;

use App\Entity\Payment;
use App\Entity\Status;
use App\Entity\User;
use App\Repository\PaymentRepository;
use App\Repository\StripcardRepository;
use App\Repository\UserRepository;
use DateTime;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Swift_Mailer;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * Class PaymentController
 * @package App\Controller
 * @author Collin Franckena <collin.franckena001@fclive.nl> <collinfranckena77@gmail.com>, Crebo: 15187 , Friesland College Heereveen, Student number:227398.
 * @version 1.0
 * @Route("/payment", name="payment_")
 */
class PaymentController extends BaseController
{
    /**
     * @var EntityManager
     */
    private $em;

    /**
     * @var PaymentRepository
     */
    private $repository;

    /**
     * @var UserRepository
     */
    private $paymentRepository;

    /**
     * @var SerializerInterface
     */
    private $serializer;

    public function __construct(
        Swift_Mailer $swift_Mailer,
        EntityManagerInterface $em,
        StripcardRepository $repository,
        PaymentRepository $paymentRepository,
        SerializerInterface $serializer
    )
    {
        parent::__construct($swift_Mailer);
        $this->em = $em;
        $this->repository = $repository;
        $this->paymentRepository = $paymentRepository;
        $this->serializer = $serializer;
    }

    /**
     *  Method for retrieving payment of a user.
     *
     * @Route("/{id}", name="get", methods={"GET"})
     * @IsGranted("ROLE_BEHEERDER")
     *
     * @param Integer $id
     * @return Response
     */
    public function getPayment(int $id = 0)
    {
        if ($id == 0) {
            $payment = $this->getDoctrine()->getRepository(Payment::class)->findAll();
        } else if (!$this->paymentRepository->find($id)) {
            return $this->sendError(400, "User not found");
        } else {
            $payment = $this->paymentRepository->find($id);
        }
        return $this->sendResponse(200, $payment);
    }

    /**
     * @Route("/create", name="new", methods={"POST"})
     * @IsGranted("ROLE_BEHEERDER")
     *
     * @param Request $request
     * @return Response
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function newPayment(Request $request)
    {
        $data = json_decode($request->getContent());
        if ((!isset($data->userId)) && (!isset($data->quantity)) && (!isset($data->amount)) && (!isset($data->discount))) {
            return $this->sendError(400, "Missing required parameters");
        }

        $payment = new Payment();
        $user = $this->getDoctrine()->getRepository(User::class)->find($data->userId);
        $payment->setStripcardId($this->repository->find($user->getStrippen()));
        $payment->setAmount((int)$data->amount);
        $payment->setDiscount((int)$data->discount);
        $payment->setQuantity((int)$data->quantity);
        $payment->setDateCreated(new DateTime('now'));
        if ($data->paid == true) {
            $payment->setDatePaid(new DateTime('now'));
            $payment->setStatus($this->getDoctrine()->getRepository(Status::class)->find(2)); //PAID
        } else {
            $payment->setStatus($this->getDoctrine()->getRepository(Status::class)->find(1)); //UNPAID
        }
        $this->em->persist($payment);
        $this->em->flush();

        return $this->sendResponse(201, $payment);
    }

    /**
     * @Route("/{id}", name="update", methods={"PATCH", "POST"})
     * @IsGranted("ROLE_BEHEERDER")
     *
     * @param Request $request
     * @param $id
     * @return Response
     */
    public function updatePayment(Request $request, $id)
    {
        $data = json_decode($request->getContent());
        if (!isset($id)) {
            return $this->sendError(400, "Missing required parameters");
        }
        if (!$this->paymentRepository->find($id)) {
            return $this->sendError(400, "Payment not found");
        }
        if (!isset($data->quantity) && !isset($data->amount) && !isset($data->discount) && !isset($data->paid)) {
            return $this->sendError(400, "Missing required parameters");
        }
        $payment = $this->paymentRepository->find($id);

        if (isset($data->discount) && !empty($data->discount)) {
            $payment->setDiscount($data->discount);
        }
        if (isset($data->quantity) && !empty($data->quantity)) {
            $payment->setQuantity($data->quantity);
        }
        if (isset($data->amount) && !empty($data->amount)) {
            $payment->setAmount($data->amount);
        }
        if (isset($data->paid)) {
            if ($data->paid == true) {
                $payment->setDatePaid(new DateTime("now"));
                $payment->setStatus($this->getDoctrine()->getRepository(Status::class)->find(2));
            } else {
                $payment->setDatePaid(null);
                $payment->setStatus($this->getDoctrine()->getRepository(Status::class)->find(1));
            }
        }

        try {
            $this->em->flush();
        } catch (OptimisticLockException $e) {
        } catch (ORMException $e) {
        }

        return $this->sendResponse(200, $payment);
    }


}
