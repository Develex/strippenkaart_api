<?php

namespace App\Tests\Controller\API;

use PHPUnit\Framework\TestCase;


class StripcardControllerTest extends TestCase
{

    /**
     * need to login to test the actions.
     *
     * @test
     */
    public function loginAction()
    {
        $client = new \GuzzleHttp\Client([
            'base_url' => 'http://localhost:8001',
            'defaults' => [
                'exceptions' => false
            ]
        ]);

        $auth = "Basic " . base64_encode("collinfranckena77@gmail.com:test");
        $headers = [
            'Authorization' => $auth
        ];

        $response = $client->post('https://localhost:8000/api/v1/auth/login', [
            'headers' => $headers
        ]);
        $this->assertEquals(201, $response->getStatusCode());
        return json_decode($response->getBody()->getContents());
    }

    /**
     * @test
     * @depends loginAction
     * @param $rData
     */
    public function updateAction($rData)
    {
        $client = new \GuzzleHttp\Client([
            'base_url' => 'http://localhost:8001',
            'defaults' => [
                'exceptions' => false
            ]
        ]);
        $headers = [
            'Authorization' => 'Bearer ' . $rData->access_token,
        ];
        $data = [
            "change" => 5
        ];
        $response = $client->post('https://localhost:8000/api/v1/stripcard/1', [
            'body' => json_encode($data),
            'headers' => $headers,
            'http_errors' => false
        ]);
        print_r("Testing postNewAction()");
        $this->assertEquals(200 || 409, $response->getStatusCode());
        print_r("\n  Expecting: 201 or 409, Got: " . $response->getStatusCode());
        $decodedData = json_decode($response->getBody(), true);
//        print_r($decodedData);
        $this->assertArrayHasKey('access_token', $decodedData);
        print_r("\n  Got access Token " . $decodedData['access_token']);
    }

}