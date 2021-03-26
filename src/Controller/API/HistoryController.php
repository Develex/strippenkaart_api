<?php /** @noinspection ALL */


namespace App\Controller\API;


use App\Repository\HistoryRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * Class StripcardController
 * @package App\Controller\API
 * @Route("/history", name="history_")
 */
class HistoryController extends BaseController
{

    /**
     * @var EntityManager
     */
    private $em;

    /**
     * @var HistoryRepository
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
        HistoryRepository $repository,
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
     *  Method for retrieving stripcard of a user.
     *
     * @Route("/{id}", name="get", methods={"GET"})
     * @IsGranted("ROLE_BEHEERDER")
     *
     * @param Integer $id
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function getHistory(int $id = 0)
    {
        if ($id == 0) {
            $history = $this->repository->findAll();
        } else if (!$this->repository->find($id)) {
            return $this->sendError(400, "History entry not found");
        } else {
            $history = $this->repository->find($id);
        }

        return $this->sendResponse(200, $history);
    }
}