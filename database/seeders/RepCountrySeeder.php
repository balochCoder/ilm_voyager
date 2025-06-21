<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RepCountry;
use App\Models\Country;

class RepCountrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some active countries to use as representatives
        $countries = Country::where('is_active', true)->take(10)->get();

        if ($countries->isEmpty()) {
            $this->command->warn('No active countries found. Please run CountrySeeder first.');
            return;
        }

        $repCountriesData = [
            [
                'country_id' => $countries->first()->id,
                'monthly_living_cost' => '$2,500 - $3,500',
                'visa_requirements' => "1. Valid passport with at least 6 months validity\n2. Completed visa application form\n3. Proof of financial support\n4. Letter of acceptance from educational institution\n5. Health insurance coverage\n6. Police clearance certificate\n7. Medical examination results",
                'part_time_work_details' => "Students are allowed to work up to 20 hours per week during academic sessions and full-time during scheduled breaks. Work must be on-campus or authorized off-campus employment. Students must maintain full-time enrollment status.",
                'country_benefits' => "• High-quality education system\n• Diverse cultural experience\n• Post-study work opportunities\n• Access to world-class research facilities\n• Strong international student support\n• Beautiful natural landscapes\n• Safe and welcoming environment",
                'is_active' => true,
            ],
            [
                'country_id' => $countries->skip(1)->first()->id,
                'monthly_living_cost' => '$3,000 - $4,000',
                'visa_requirements' => "1. Student visa application (Tier 4)\n2. Confirmation of Acceptance for Studies (CAS)\n3. Proof of English language proficiency\n4. Financial evidence showing sufficient funds\n5. Tuberculosis test results\n6. Academic qualifications and transcripts\n7. Personal statement and references",
                'part_time_work_details' => "Tier 4 students can work up to 20 hours per week during term time and unlimited hours during holidays. Work must not interfere with studies. Students cannot be self-employed or work as professional sportspeople or entertainers.",
                'country_benefits' => "• Prestigious universities and colleges\n• Rich cultural heritage and history\n• Excellent career opportunities\n• Access to European travel\n• Strong research and innovation culture\n• Multicultural society\n• World-class healthcare system",
                'is_active' => true,
            ],
            [
                'country_id' => $countries->skip(2)->first()->id,
                'monthly_living_cost' => '$2,000 - $3,200',
                'visa_requirements' => "1. Study permit application\n2. Letter of acceptance from Designated Learning Institution\n3. Proof of financial support\n4. Medical examination\n5. Police certificate\n6. Biometric information\n7. Statement of purpose",
                'part_time_work_details' => "International students can work up to 20 hours per week during regular academic sessions and full-time during scheduled breaks. Students must have a valid study permit and be enrolled full-time at a designated learning institution.",
                'country_benefits' => "• High standard of living\n• Excellent healthcare system\n• Beautiful natural scenery\n• Multicultural society\n• Strong economy and job market\n• Quality education at affordable costs\n• Safe and peaceful environment",
                'is_active' => true,
            ],
            [
                'country_id' => $countries->skip(3)->first()->id,
                'monthly_living_cost' => '$2,800 - $3,800',
                'visa_requirements' => "1. Student visa (subclass 500)\n2. Confirmation of Enrollment (CoE)\n3. Genuine Temporary Entrant (GTE) statement\n4. Financial capacity evidence\n5. Health insurance (OSHC)\n6. English language proficiency\n7. Health and character requirements",
                'part_time_work_details' => "Student visa holders can work up to 40 hours per fortnight during course sessions and unlimited hours during scheduled course breaks. Students must maintain course attendance and academic progress.",
                'country_benefits' => "• World-class education institutions\n• Beautiful beaches and landscapes\n• Excellent quality of life\n• Strong economy and job opportunities\n• Multicultural and welcoming society\n• Great weather and outdoor lifestyle\n• Post-study work opportunities",
                'is_active' => true,
            ],
            [
                'country_id' => $countries->skip(4)->first()->id,
                'monthly_living_cost' => '$1,800 - $2,500',
                'visa_requirements' => "1. Student visa application\n2. Offer letter from educational institution\n3. Proof of financial means\n4. Health and character certificates\n5. Academic qualifications\n6. English language proficiency\n7. Medical and travel insurance",
                'part_time_work_details' => "International students can work up to 20 hours per week during academic sessions and full-time during scheduled breaks. Students must maintain full-time enrollment and satisfactory academic progress.",
                'country_benefits' => "• Affordable education costs\n• High-quality education system\n• Beautiful landscapes and outdoor activities\n• Friendly and welcoming people\n• Safe and peaceful environment\n• Strong economy\n• Excellent work-life balance",
                'is_active' => false,
            ],
        ];

        foreach ($repCountriesData as $data) {
            // Check if the country already has a rep country
            $existingRepCountry = RepCountry::where('country_id', $data['country_id'])->first();
            
            if (!$existingRepCountry) {
                RepCountry::create($data);
                $this->command->info("Created rep country for: " . Country::find($data['country_id'])->name);
            } else {
                $this->command->warn("Rep country already exists for: " . Country::find($data['country_id'])->name);
            }
        }

        $this->command->info('RepCountrySeeder completed successfully!');
    }
} 