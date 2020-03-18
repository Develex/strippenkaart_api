<?php

namespace App\Controller\Tests;

use GuzzleHttp\Client;
use PHPUnit\Framework\TestCase;

class UserControllerTest extends TestCase
{
    /**
     * @test
     */
    public function postNewAction()
    {
        $client = new Client([
            'base_url' => 'http://localhost:8000',
            'defaults' => [
                'exceptions' => false
            ]
        ]);

        $email = 'ObjectOrienter' . rand(0, 999) . '@testmail.nl';
        $data = array(
            'email' => $email,
            'password' => 'testPassword'
        );

        $response = $client->post('https://127.0.0.1:8000/user', [
            'body' => json_encode($data)
        ]);

        $this->assertEquals(201, $response->getStatusCode());
        $decodedData = json_decode($response->getBody(), true);
        $this->assertArrayHasKey('id', $decodedData);
    }
}
