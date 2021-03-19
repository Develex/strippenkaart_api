<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class TestController extends AbstractController
{
    /**
     * @Route("/test", name="test")
     *
     * @return Response
     */
    public function index(): Response
    {
        return $this->render('test/index.html.twig', [
        ]);
    }

    /**
     * @Route("/test/strippenkaart", name="test_strippenkaart")
     *
     * @return Response
     */
    public function stripcardAction(): Response
    {
        return $this->render('test/stripcard.html.twig', [
        ]);
    }
}
