<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\RepCountry;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

final class RepCountryStatusChanged extends Notification implements ShouldQueue
{
    use Queueable;

    public $repCountry;

    public $statusName;

    public function __construct(RepCountry $repCountry, string $statusName)
    {
        $this->repCountry = $repCountry;
        $this->statusName = $statusName;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('RepCountry Status Changed')
            ->line('The status for a represented country has changed.')
            ->line('Country: '.$this->repCountry->country->name)
            ->line('New Status: '.$this->statusName)
            ->action('View RepCountry', url('/rep-countries/'.$this->repCountry->id));
    }
}
