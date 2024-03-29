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
        EntityManagerInterface $em,
        StripcardRepository $repository,
        UserRepository $userRepository,
        SerializerInterface $serializer
    )
    {
        parent::__construct();

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
        $stripcard->setStrips(isset($data->amount) ? $data->amount : 0);
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
    public function getStripcard(int $id = 0)
    {
        if ($id == 0) {
            $stripcard = $this->repository->findAll();
        } else if (!$this->userRepository->find($id)) {
            return $this->sendError(400, "User not found");
        } else {
            $user = $this->userRepository->find($id);
            $stripcard = $user->getStrippen();
        }

        return $this->sendResponse(200, $stripcard);
    }

    /**
     * Method for updating a stripcard of a user.
     *
     * @Route("/{id}", name="update", methods={"PUT", "POST"})
     * @IsGranted("ROLE_STAMPER")
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
        $oldAmount = $stripcard->getStrips();
        if (($oldAmount + $requestData->change < 0) && ($requestData->change < 0)) {
            return $this->sendError(422, "User has not enough strips for exchange.");
        }
        $stripcard->setStrips($oldAmount + $requestData->change);
        $this->em->flush();

        return $this->sendResponse(200, $stripcard);
    }
}