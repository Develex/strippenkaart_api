<?php /** @noinspection ALL */


namespace App\Controller\API;


use App\Entity\Stripcard;
use App\Repository\StripcardRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * Class StripcardController
 * @package App\Controller\API
 * @Route("/stripcard", name="stripcard_")
 */
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

    /**
     * Method for creation of Stripcards.
     *  The amount is set if available, otherwise it wil default to 0.
     *
     * @Route("/create", name="create", methods={"POST"})
     * @IsGranted("ROLE_BEHEERDER")
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function newStripcard(Request $request)
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

        return $this->sendResponse(201, $stripcard);
    }

    /**
     *  Method for retrieving stripcard of a user.
     *
     * @Route("/{id}", name="get", methods={"GET"})
     * @IsGranted("ROLE_USER")
     *
     * @param Integer $id
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function getStripcard($id)
    {
        if (!$id) {
            return $this->sendError(400, "Missing required parameters");
        }
        if (!$this->userRepository->find($id)) {
            return $this->sendError(400, "User not found");
        }

        $user = $this->userRepository->find($id);
        $stripcard = $user->getStrippen();

        return $this->sendResponse(200, $stripcard);
    }

    /**
     * Method for updating a stripcard of a user.
     *
     * @Route("/{id}", name="update", methods={"PUT", "POST"})
     * @IsGranted("ROLE_BEHEERDER")
     *
     * @param Request $request
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function updateStripcard(Request $request, $id)
    {
        $requestData = json_decode($request->getContent());
        if (!$id) {
            return $this->sendError(400, "Missing required parameters");
        }
        if (!$this->userRepository->find($id)) {
            return $this->sendError(400, "User not found");
        }

        $stripcard = $this->userRepository->find($id)->getStrippen();
        $oldAmount = $stripcard->getAmount();
        $stripcard->setAmount($oldAmount + $requestData->change);
        $this->em->flush();

        return $this->sendResponse(200, $stripcard);
    }
}