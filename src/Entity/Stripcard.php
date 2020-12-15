<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use JsonSerializable;

/**
 * @ORM\Entity(repositoryClass=StrippenRepository::class)
 */
class Stripcard implements JsonSerializable
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private
        $id;

    /**
     * @ORM\OneToOne(targetEntity=User::class, inversedBy="stripcard", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     */
    private
        $user;

    /**
     * @ORM\Column(type="integer")
     */
    private
        $amount;

    public
    function getId(): ?int
    {
        return $this->id;
    }

    public
    function getUser(): ?User
    {
        return $this->user;
    }

    public
    function setUser(User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public
    function getAmount(): ?int
    {
        return $this->amount;
    }

    public
    function setAmount(int $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    /**
     * @inheritDoc
     */
    public
    function jsonSerialize()
    {
        return [
            "id" => $this->id,
            "user" => $this->user,
            "amount" => $this->amount
        ];
    }
}
