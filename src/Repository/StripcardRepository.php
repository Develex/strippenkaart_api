<?php

namespace App\Repository;

use App\Entity\Stripcard;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Stripcard|null find($id, $lockMode = null, $lockVersion = null)
 * @method Stripcard|null findOneBy(array $criteria, array $orderBy = null)
 * @method Stripcard[]    findAll()
 * @method Stripcard[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class StripcardRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Stripcard::class);
    }

    // /**
    //  * @return Stripcard[] Returns an array of Stripcard objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('s.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Stripcard
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
