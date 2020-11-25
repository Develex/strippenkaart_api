<?php

namespace App\Controller\Tests;

use GuzzleHttp\Client;
use PHPUnit\Framework\TestCase;

class UserControllerTest extends TestCase
{
    /**
     * @test
     */
    public function loginAction(){
        $client = new Client([
            'base_url' => 'http://localhost:8000',
            'defaults' => [
                'exceptions' => false
            ]
        ]);

        $auth = "Basic " . base64_encode("test@test.com:test");
        $headers = [
            'Authorization' => $auth
        ];

        $response = $client->post('https://strippenkaart.collinfranckena.com/api/v1/register', [
            'headers' => $headers
            ]);
    }

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

        $headers = [
            'Authorization' => 'Bearer vqrNfdY_aCu5ext0lYCtjxe0g4s=',
        ];

        $response = $client->post('https://strippenkaart.collinfranckena.com/api/v1/user', [
            'body' => json_encode($data),
            'headers' => $headers,
            'http_errors' => false
        ]);

        print_r("Testing postNewAction()");
        $this->assertEquals(201 || 409, $response->getStatusCode());
        print_r("\n  Expecting: 201 or 409, Got: " . $response->getStatusCode());
        $decodedData = json_decode($response->getBody(), true);
        $this->assertArrayHasKey('access_token', $decodedData);
        print_r("\n  Got access Token " . $decodedData['access_token']);

        $id = json_decode($decodedData['data'])->id;
        print_r("\n\n New Test User ID: " . $id);
        return $id;
    }

    /**
     * @depends postNewAction
     * @test
     * @param $id
     */
    public function patchUpdateAction($id)
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

        $headers = [
            'Authorization' => 'Bearer vqrNfdY_aCu5ext0lYCtjxe0g4s=',
        ];

        $response = $client->patch('https://strippenkaart.collinfranckena.com/api/v1/user/' . $id, [
            'body' => json_encode($data),
            'headers' => $headers,
            'http_errors' => false
        ]);

        print_r("\n\n Testing patchUpdateAction()");
        $this->assertEquals(200, $response->getStatusCode());
        print_r("\n  Expecting: 200, Got: " . $response->getStatusCode());

        $decodedData = json_decode($response->getBody(), true);
        $this->assertArrayHasKey('access_token', $decodedData);
        print_r("\n  Got access Token " . $decodedData['access_token']);
    }

    /**
     * @depends postNewAction
     * @test
     * @param $id
     */
    public function getAction($id)
    {
        $client = new Client([
            'base_url' => 'http://localhost:8000',
            'defaults' => [
                'exceptions' => false
            ]
        ]);

        $email = 'ObjectOrienter' . rand(0, 999) . '@testmail.nl';
        $data = [];

        $headers = [
            'Authorization' => 'Bearer vqrNfdY_aCu5ext0lYCtjxe0g4s=',
        ];

        $response = $client->get('https://strippenkaart.collinfranckena.com/api/v1/user/' . $id, [
            'body' => json_encode($data),
            'headers' => $headers,
            'http_errors' => false
        ]);

        print_r("\n\n Testing getAction()");
        $this->assertEquals(200, $response->getStatusCode());
        print_r("\n  Expecting: 200, Got: " . $response->getStatusCode());

        $decodedData = json_decode($response->getBody(), true);
        $this->assertArrayHasKey('access_token', $decodedData);
        print_r("\n  Got access Token " . $decodedData['access_token']);
    }

    /**
     * @depends postNewAction
     * @test
     * @param $id
     */
    public function patchChangeRoleAction($id)
    {
        $client = new Client([
            'base_url' => 'http://localhost:8000',
            'defaults' => [
                'exceptions' => false
            ]
        ]);

        $email = 'ObjectOrienter' . rand(0, 999) . '@testmail.nl';
        $data = array(
            'role' => "ROLE_BEHEERDER"
        );

        $headers = [
            'Authorization' => 'Bearer vqrNfdY_aCu5ext0lYCtjxe0g4s=',
        ];

        $response = $client->patch('https://strippenkaart.collinfranckena.com/api/v1/user/roles/' . $id, [
            'body' => json_encode($data),
            'headers' => $headers,
            'http_errors' => false
        ]);

        print_r("\n\n Testing patchChangeRoleAction()");
        $this->assertEquals(200, $response->getStatusCode());
        print_r("\n  Expecting: 200, Got: " . $response->getStatusCode());

        $decodedData = json_decode($response->getBody(), true);
        $this->assertArrayHasKey('access_token', $decodedData);
        print_r("\n  Got access Token " . $decodedData['access_token']);
    }

    /**
     * @depends postNewAction
     * @test
     * @param $id
     */
    public function deleteAction($id)
    {
        $client = new Client([
            'base_url' => 'http://localhost:8000',
            'defaults' => [
                'exceptions' => false
            ]
        ]);

        $email = 'ObjectOrienter' . rand(0, 999) . '@testmail.nl';
        $data = [];

        $headers = [
            'Authorization' => 'Bearer vqrNfdY_aCu5ext0lYCtjxe0g4s=',
        ];

        $response = $client->delete('https://strippenkaart.collinfranckena.com/api/v1/user/' . $id, [
            'body' => json_encode($data),
            'headers' => $headers,
            'http_errors' => false
        ]);

        print_r("\n\n Testing deleteAction()");
        $this->assertEquals(200, $response->getStatusCode());
        print_r("\n  Expecting: 200, Got: " . $response->getStatusCode());

        $decodedData = json_decode($response->getBody(), true);
        $this->assertArrayHasKey('access_token', $decodedData);
        print_r("\n  Got access Token " . $decodedData['access_token']);
    }
}
