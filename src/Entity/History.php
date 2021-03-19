<?php

namespace App\Entity;

use App\Repository\HistoryRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=HistoryRepository::class)
 */
class History extends User
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $recordNumber;

    /**
     * @ORM\Column(type="datetime")
     */
    private $dateChanged;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="histories")
     * @ORM\JoinColumn(nullable=false)
     */
    private $ChangedBy;

    /**
     * @ORM\ManyToOne(targetEntity=TableName::class)
     * @ORM\JoinColumn(nullable=false)
     */
    private $entity;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRecordNumber(): ?int
    {
        return $this->recordNumber;
    }

    public function setRecordNumber(int $recordNumber): self
    {
        $this->recordNumber = $recordNumber;

        return $this;
    }

    public function getDateChanged(): ?\DateTimeInterface
    {
        return $this->dateChanged;
    }

    public function setDateChanged(\DateTimeInterface $dateChanged): self
    {
        $this->dateChanged = $dateChanged;

        return $this;
    }

    public function getChangedBy(): ?User
    {
        return $this->ChangedBy;
    }

    public function setChangedBy(?User $ChangedBy): self
    {
        $this->ChangedBy = $ChangedBy;

        return $this;
    }

    public function getEntity(): ?TableName
    {
        return $this->entity;
    }

    public function setEntity(?TableName $entity): self
    {
        $this->entity = $entity;

        return $this;
    }
}
