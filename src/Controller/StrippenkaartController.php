<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class StrippenkaartController extends AbstractController
{
    /**
     * @Route("/strippenkaart", name="strippenkaart")
     */
    public function index(): Response
    {
        return $this->render('strippenkaart/index.html.twig', [
            'controller_name' => 'StrippenkaartController',
            'SERVER_ADDRESS' => $_ENV["SERVER_ADDRESS"],
        ]);
    }
}
