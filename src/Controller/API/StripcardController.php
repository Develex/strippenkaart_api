<?php /** @noinspection ALL */


namespace App\Controller\API;


use App\Entity\Stripcard;
use App\Repository\StripcardRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Serializer\SerializerInterface;

class StripcardController extends BaseController
{

    /**
     * @var EntityManager
     */
    private $em;

    /**
     * @var StripcardRepository
     */
    private $repository;

    /**
     * @var UserRepository
     */
    private $userRepository;

    /**
     * @var SerializerInterface
     */
    private $serializer;

    public function __construct(
        \Swift_Mailer $swift_Mailer,
        EntityManagerInterface $em,
        StripcardRepository $repository,
        UserRepository $userRepository,
        SerializerInterface $serializer
    )
    {
        parent::__construct($swift_Mailer);

        $this->em = $em;
        $this->repository = $repository;
        $this->userRepository = $userRepository;
        $this->serializer = $serializer;
    }

    public function newStripcard()
    {
        $data = json_decode($request->getContent());
        if (!isset($data->user)) {
            return $this->sendError(400, "Missing required parameters");
        }
        if (!$this->userRepository->find($data->user)) {
            return $this->sendError(400, "User not found");
        }

        $stripcard = new Stripcard();
        $stripcard->setUser($this->userRepository->find($data->user));
        $stripcard->setAmount(isset($data->amount) ? $data->amount : 0);
        $this->em->persist($stripcard);
        $this->em->flush();

        $response = $this->serializer->serialize($stripcard, "json");
        return $this->sendResponse(201, $response);
    }
}