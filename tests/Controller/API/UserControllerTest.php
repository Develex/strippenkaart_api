<?php

namespace App\Tests\Controller\API;


use GuzzleHttp\Client;
use PHPUnit\Framework\TestCase;

class UserControllerTest extends TestCase
{
    /**
     * @var \Doctrine\ORM\EntityManager
     */
    private $entityManager;

    /**
     * @test
     * @return
     */
    public function loginAction()
    {
        $client = new Client([
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
        $responseData = json_decode($response->getBody()->getContents());
        return $responseData->access_token;
    }
//
//    /**
//     * @test
//     * @depends loginAction
//     * @param $access_token
//     * @return array
//     */
//    public function postNewAction($access_token)
//    {
//        $client = new Client([
//            'base_url' => 'http://localhost:8000',
//            'defaults' => [
//                'exceptions' => false
//            ]
//        ]);
//
//        $email = 'ObjectOrienter' . rand(0, 999) . '@testmail.nl';
//        $data = array(
//            'email' => $email,
//            'password' => 'testPassword'
//        );
//
//        $headers = [
//            'Authorization' => 'Bearer ' . $access_token,
//        ];
//
//        $response = $client->post('https://localhost:8000/api/v1/user', [
//            'body' => json_encode($data),
//            'headers' => $headers,
//            'http_errors' => false
//        ]);
//
//        print_r("Testing postNewAction()");
//        $this->assertEquals(201 || 409, $response->getStatusCode());
//        print_r("\n  Expecting: 201 or 409, Got: " . $response->getStatusCode() . "\n");
//        $decodedData = json_decode($response->getBody(), true);
////        print_r($decodedData);
//        $this->assertArrayHasKey('access_token', $decodedData);
//        print_r("\n  Got access Token " . $decodedData['access_token']);
//
//        $id = json_decode($decodedData['data'])->id;
//        print_r("\n\n New Test User ID: " . $id);
//        $user = $this->objectManager->getRepository(User::class)->find($id);
//        var_dump($user);
//        $user->setActive(true)->setVerified(true);
//        $this->objectManager->flush();
//
//        return [$id, $access_token];
//    }
//
//    /**
//     * @depends patchUpdateAction
//     * @test
//     * @param $rData
//     */
//    public function patchUpdateAction($rData)
//    {
//        $client = new Client([
//            'base_url' => 'http://localhost:8000',
//            'defaults' => [
//                'exceptions' => false
//            ]
//        ]);
//
//        $email = 'ObjectOrienter' . rand(0, 999) . '@testmail.nl';
//        $data = array(
//            'email' => $email,
//            'password' => 'testPassword'
//        );
//
//        $headers = [
//            'Authorization' => 'Bearer ' . $rData[1],
//        ];
//
//        $response = $client->patch('https://localhost:8000/api/v1/user/' . $rData[0], [
//            'body' => json_encode($data),
//            'headers' => $headers,
//            'http_errors' => false
//        ]);
//
//        print_r("\n\n Testing patchUpdateAction()");
//        $this->assertEquals(200, $response->getStatusCode());
//        print_r("\n  Expecting: 200, Got: " . $response->getStatusCode());
//
//        $decodedData = json_decode($response->getBody(), true);
//        $this->assertArrayHasKey('access_token', $decodedData);
//        print_r("\n  Got access Token " . $decodedData['access_token']);
//    }
//
//    /**
//     * @depends loginAction
//     * @test
//     * @param $rData
//     */
//    public function getAction($rData)
//    {
//        $client = new Client([
//            'base_url' => 'http://localhost:8000',
//            'defaults' => [
//                'exceptions' => false
//            ]
//        ]);
//
////        $email = 'ObjectOrienter' . rand(0, 999) . '@testmail.nl';
////        $data = [];
//
//        $headers = [
//            'Authorization' => 'Bearer ' . $rData[1],
//        ];
//
//        $response = $client->get('https://localhost:8000/api/v1/user/' . $rData[0], [
////            'body' => json_encode($data),
//            'headers' => $headers,
//            'http_errors' => false
//        ]);
//
//        print_r("\n\n Testing getAction()");
//        $this->assertEquals(200, $response->getStatusCode());
//        print_r("\n  Expecting: 200, Got: " . $response->getStatusCode());
//
//        $decodedData = json_decode($response->getBody(), true);
//        $this->assertArrayHasKey('access_token', $decodedData);
//        print_r("\n  Got access Token " . $decodedData['access_token']);
//    }
//
//    /**
//     * @depends loginAction
//     * @test
//     * @param $rData
//     */
//    public function patchChangeRoleAction($rData)
//    {
//        $client = new Client([
//            'base_url' => 'http://localhost:8000',
//            'defaults' => [
//                'exceptions' => false
//            ]
//        ]);
//
////        $email = 'ObjectOrienter' . rand(0, 999) . '@testmail.nl';
//        $data = array(
//            'role' => "ROLE_BEHEERDER"
//        );
//
//        $headers = [
//            'Authorization' => 'Bearer ' . $rData[1],
//        ];
//
//        $response = $client->patch('https://localhost:8000/api/v1/user/roles/' . $rData[0], [
//            'body' => json_encode($data),
//            'headers' => $headers,
//            'http_errors' => false
//        ]);
//
//        print_r("\n\n Testing patchChangeRoleAction()");
//        $this->assertEquals(200, $response->getStatusCode());
//        print_r("\n  Expecting: 200, Got: " . $response->getStatusCode());
//
//        $decodedData = json_decode($response->getBody(), true);
//        $this->assertArrayHasKey('access_token', $decodedData);
//        print_r("\n  Got access Token " . $decodedData['access_token']);
//    }
//
//    /**
//     * @depends loginAction
//     * @test
//     * @param $rData
//     */
//    public function deleteAction($rData)
//    {
//        $client = new Client([
//            'base_url' => 'http://localhost:8000',
//            'defaults' => [
//                'exceptions' => false
//            ]
//        ]);
//
//        $email = 'ObjectOrienter' . rand(0, 999) . '@testmail.nl';
//        $data = [];
//
//        $headers = [
//            'Authorization' => 'Bearer ' . $rData[1],
//        ];
//
//        $response = $client->delete('https://localhost:8000/api/v1/user/' . $rData[0], [
//            'body' => json_encode($data),
//            'headers' => $headers,
//            'http_errors' => false
//        ]);
//
//        print_r("\n\n Testing deleteAction()");
//        $this->assertEquals(200, $response->getStatusCode());
//        print_r("\n  Expecting: 200, Got: " . $response->getStatusCode());
//
//        $decodedData = json_decode($response->getBody(), true);
//        $this->assertArrayHasKey('access_token', $decodedData);
//        print_r("\n  Got access Token " . $decodedData['access_token']);
//    }
}
