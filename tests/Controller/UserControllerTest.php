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

        $response = $client->post('http://84.81.153.51/user', [
            'body' => json_encode($data)
        ]);

        $this->assertEquals(201, $response->getStatusCode());
        $decodedData = json_decode($response->getBody(), true);
        $this->assertArrayHasKey('id', $decodedData);
    }

    /**
     * @test
     */
    public function patchUpdateAction()
    {
        $client = new Client([
            'base_url' => 'http://localhost:8000',
            'defaults' => [
                'exceptions' => false
            ]
        ]);

        $email = 'ObjectOrienter' . rand(0, 999) . '@testmail.nl';
        $data = array(
            'id' => '1',
            'email' => $email,
            'password' => 'testPassword'
        );

        $response = $client->patch('http://84.81.153.51/user', [
            'body' => json_encode($data)
        ]);

        $this->assertEquals(200, $response->getStatusCode());
        $decodedData = json_decode($response->getBody(), true);
        $this->assertArrayHasKey('id', $decodedData);
    }
}
