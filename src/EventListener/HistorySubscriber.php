<?php

namespace App\EventListener;


use App\Entity\History;
use App\Entity\Payment;
use App\Entity\TableName;
use Doctrine\Common\EventSubscriber;
use Doctrine\Common\Persistence\Event\LifecycleEventArgs;
use Doctrine\ORM\Events;
use Doctrine\ORM\ORMException;
use Symfony\Component\Security\Core\Security;

class HistorySubscriber implements EventSubscriber
{

    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    public function getSubscribedEvents()
    {
        return [
            Events::postPersist,
            Events::postRemove,
            Events::postUpdate,
        ];
    }

    public function postPersist(LifecycleEventArgs $args): void
    {
        $this->logActivity('persist', $args);
    }

    private function logActivity(string $string, LifecycleEventArgs $args)
    {
        $entity = $args->getObject();
        if (!$entity instanceof Payment) {
            return;
        }

//        dd($entity);
        $em = $args->getObjectManager();

        $historyEntry = new History();
        $historyEntry->setChangedBy($this->security->getUser());
        $historyEntry->setDateChanged(new \DateTime('now'));
        $historyEntry->setEntity($em->getRepository(TableName::class)->findOneBy(['name' => $em->getClassMetadata(get_class($entity))->getTableName()]));
        $historyEntry->setRecordNumber($entity->getId());
        try {
            $em->persist($historyEntry);
            $em->flush();
        } catch (ORMException $e) {
            dd($e);
        }
    }

    public function postRemove(LifecycleEventArgs $args): void
    {
        $this->logActivity('remove', $args);
    }

    public function postUpdate(LifecycleEventArgs $args): void
    {
        $this->logActivity('update', $args);
    }

//    public function postUpdate(Payment $payment, LifecycleEventArgs $args): void
//    {
//        $entity = $args->getObject();
//        dd($this->security->getUser());
//
//        $em = $args->getEntityManager();
//
//        $historyEntry = new History();
//        $historyEntry->setChangedBy($this->security->getUser());
//        $historyEntry->setDateChanged(new \DateTime('now'));
//        $historyEntry->setEntity($em->getRepository(TableName::class)->findOneBy(['name' => $em->getClassMetadata(get_class($entity))->getTableName()]));
//        $historyEntry->setRecordNumber($entity->getId());
//        try {
//            $em->persist($historyEntry);
//            $em->flush();
//        } catch (ORMException $e) {
//            dd($e);
//        }
//    }


}