<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_landlords_can_register_and_must_verify_email(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test Landlord',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'terms' => true,
        ]);

        $this->assertAuthenticated();

        $user = User::where('email', 'test@example.com')->first();
        $this->assertNotNull($user);
        $this->assertSame('landlord', $user->role);
        $this->assertFalse($user->hasVerifiedEmail());
        $response->assertRedirect(route('verification.notice', absolute: false));
    }

    public function test_public_registration_cannot_create_non_landlord_roles(): void
    {
        $this->post('/register', [
            'name' => 'Not A Tenant',
            'email' => 'tenant-try@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => 'tenant',
            'terms' => true,
        ]);

        $this->assertAuthenticated();
        $this->assertSame('landlord', User::where('email', 'tenant-try@example.com')->value('role'));
    }

    public function test_registration_requires_accepting_terms(): void
    {
        $response = $this->from('/register')->post('/register', [
            'name' => 'Test Landlord',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'terms' => false,
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors('terms');
    }

    public function test_unverified_users_cannot_access_the_dashboard(): void
    {
        $user = User::factory()->unverified()->create();

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertRedirect(route('verification.notice', absolute: false));
    }
}
