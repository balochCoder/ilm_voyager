<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\TenantRolesEnum;
use App\Models\Branch;
use App\Models\Country;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CourseLevel;
use App\Models\Counsellor;
use App\Models\Currency;
use App\Models\Institution;
use App\Models\ProcessingOffice;
use App\Models\RepCountry;
use App\Models\Status;
use App\Models\TimeZone;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

final class RepCountrySeeder extends Seeder
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

        $currencies = Currency::all();
        $courseLevels = CourseLevel::all();
        $courseCategories = CourseCategory::all();
        $statusNames = Status::orderBy('order')->pluck('name')->take(10)->toArray();
        $timeZones = TimeZone::all();
        $now = now();

        $repCountriesData = [
            [
                'country_id' => $countries->first()->id,
                'monthly_living_cost' => '$2,500 - $3,500',
                'visa_requirements' => "1. Valid passport with at least 6 months validity\n2. Completed visa application form\n3. Proof of financial support\n4. Letter of acceptance from educational institution\n5. Health insurance coverage\n6. Police clearance certificate\n7. Medical examination results",
                'part_time_work_details' => 'Students are allowed to work up to 20 hours per week during academic sessions and full-time during scheduled breaks. Work must be on-campus or authorized off-campus employment. Students must maintain full-time enrollment status.',
                'country_benefits' => "• High-quality education system\n• Diverse cultural experience\n• Post-study work opportunities\n• Access to world-class research facilities\n• Strong international student support\n• Beautiful natural landscapes\n• Safe and welcoming environment",
                'is_active' => true,
            ],
            [
                'country_id' => $countries->skip(1)->first()->id,
                'monthly_living_cost' => '$3,000 - $4,000',
                'visa_requirements' => "1. Student visa application (Tier 4)\n2. Confirmation of Acceptance for Studies (CAS)\n3. Proof of English language proficiency\n4. Financial evidence showing sufficient funds\n5. Tuberculosis test results\n6. Academic qualifications and transcripts\n7. Personal statement and references",
                'part_time_work_details' => 'Tier 4 students can work up to 20 hours per week during term time and unlimited hours during holidays. Work must not interfere with studies. Students cannot be self-employed or work as professional sportspeople or entertainers.',
                'country_benefits' => "• Prestigious universities and colleges\n• Rich cultural heritage and history\n• Excellent career opportunities\n• Access to European travel\n• Strong research and innovation culture\n• Multicultural society\n• World-class healthcare system",
                'is_active' => true,
            ],
            [
                'country_id' => $countries->skip(2)->first()->id,
                'monthly_living_cost' => '$2,000 - $3,200',
                'visa_requirements' => "1. Study permit application\n2. Letter of acceptance from Designated Learning Institution\n3. Proof of financial support\n4. Medical examination\n5. Police certificate\n6. Biometric information\n7. Statement of purpose",
                'part_time_work_details' => 'International students can work up to 20 hours per week during regular academic sessions and full-time during scheduled breaks. Students must have a valid study permit and be enrolled full-time at a designated learning institution.',
                'country_benefits' => "• High standard of living\n• Excellent healthcare system\n• Beautiful natural scenery\n• Multicultural society\n• Strong economy and job market\n• Quality education at affordable costs\n• Safe and peaceful environment",
                'is_active' => true,
            ],
            [
                'country_id' => $countries->skip(3)->first()->id,
                'monthly_living_cost' => '$2,800 - $3,800',
                'visa_requirements' => "1. Student visa (subclass 500)\n2. Confirmation of Enrollment (CoE)\n3. Genuine Temporary Entrant (GTE) statement\n4. Financial capacity evidence\n5. Health insurance (OSHC)\n6. English language proficiency\n7. Health and character requirements",
                'part_time_work_details' => 'Student visa holders can work up to 40 hours per fortnight during course sessions and unlimited hours during scheduled course breaks. Students must maintain course attendance and academic progress.',
                'country_benefits' => "• World-class education institutions\n• Beautiful beaches and landscapes\n• Excellent quality of life\n• Strong economy and job opportunities\n• Multicultural and welcoming society\n• Great weather and outdoor lifestyle\n• Post-study work opportunities",
                'is_active' => true,
            ],
            [
                'country_id' => $countries->skip(4)->first()->id,
                'monthly_living_cost' => '$1,800 - $2,500',
                'visa_requirements' => "1. Student visa application\n2. Offer letter from educational institution\n3. Proof of financial means\n4. Health and character certificates\n5. Academic qualifications\n6. English language proficiency\n7. Medical and travel insurance",
                'part_time_work_details' => 'International students can work up to 20 hours per week during academic sessions and full-time during scheduled breaks. Students must maintain full-time enrollment and satisfactory academic progress.',
                'country_benefits' => "• Affordable education costs\n• High-quality education system\n• Beautiful landscapes and outdoor activities\n• Friendly and welcoming people\n• Safe and peaceful environment\n• Strong economy\n• Excellent work-life balance",
                'is_active' => false,
            ],
        ];

        // Only create 5 rep countries
        $repCountriesData = array_slice($repCountriesData, 0, 5);

        foreach ($repCountriesData as $data) {
            // Check if the country already has a rep country
            $existingRepCountry = RepCountry::where('country_id', $data['country_id'])->first();

            if (! $existingRepCountry) {
                $repCountry = RepCountry::create($data);
                $this->command->info('Created rep country for: '.Country::find($data['country_id'])->name);

                // Assign 10 statuses (from statuses table), each with 3 sub-statuses
                foreach ($statusNames as $idx => $statusName) {
                    $status = $repCountry->repCountryStatuses()->create([
                        'status_name' => $statusName,
                        'notes' => $statusName.' notes.',
                        'completed_at' => null,
                        'is_current' => $idx === 0,
                        'order' => $idx + 1,
                        'is_active' => true,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]);
                    for ($s = 1; $s <= 3; $s++) {
                        $status->subStatuses()->create([
                            'name' => $statusName.' SubStatus '.$s,
                            'description' => 'Description for '.$statusName.' SubStatus '.$s,
                            'is_completed' => false,
                            'completed_at' => null,
                            'order' => $s,
                            'is_active' => true,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ]);
                    }
                }

                // Assign 3 institutions
                for ($i = 1; $i <= 3; $i++) {
                    $currency = $currencies->random();
                    $institution = Institution::create([
                        'rep_country_id' => $repCountry->id,
                        'institution_name' => 'Institute '.$i.' for '.$repCountry->country->name,
                        'campus' => 'Main Campus',
                        'website' => 'https://example.com',
                        'monthly_living_cost' => rand(1000, 4000),
                        'funds_required_for_visa' => rand(5000, 20000),
                        'application_fee' => rand(50, 200),
                        'currency_id' => $currency->id,
                        'contract_terms' => 'Standard contract terms apply.',
                        'institute_type' => $i % 2 === 0 ? 'direct' : 'indirect',
                        'quality_of_desired_application' => ['excellent', 'good', 'average', 'below_average'][array_rand(['excellent', 'good', 'average', 'below_average'])],
                        'contract_expiry_date' => now()->addYears(rand(1, 3)),
                        'is_language_mandatory' => (bool) rand(0, 1),
                        'language_requirements' => 'IELTS 6.0 or equivalent',
                        'institutional_benefits' => 'Scholarships available for top students.',
                        'part_time_work_details' => '20 hours per week allowed.',
                        'scholarship_policy' => 'Merit-based scholarships.',
                        'institution_status_notes' => 'Accredited by Ministry of Education.',
                        'contact_person_name' => 'John Doe',
                        'contact_person_email' => 'john'.$i.'@example.com',
                        'contact_person_mobile' => '1234567890',
                        'contact_person_designation' => 'Director',
                        'is_active' => (bool) rand(0, 1),
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]);

                    // Assign 5 courses to each institution
                    for ($j = 1; $j <= 5; $j++) {
                        $courseLevel = $courseLevels->random();
                        $categories = $courseCategories->random(rand(1, min(3, $courseCategories->count())))->pluck('id')->toArray();
                        Course::create([
                            'institution_id' => $institution->id,
                            'title' => 'Course '.$j.' at '.$institution->institution_name,
                            'course_level_id' => $courseLevel->id,
                            'duration_year' => rand(1, 4),
                            'duration_month' => rand(0, 11),
                            'duration_week' => rand(0, 51),
                            'start_date' => now()->addMonths(rand(1, 12)),
                            'end_date' => now()->addYears(rand(1, 4)),
                            'campus' => 'Main Campus',
                            'awarding_body' => 'University Board',
                            'currency_id' => $currency->id,
                            'course_fee' => rand(5000, 20000),
                            'application_fee' => rand(50, 200),
                            'course_benefits' => 'Internship opportunities, job placement support.',
                            'general_eligibility' => 'Bachelor degree or equivalent.',
                            'quality_of_desired_application' => ['excellent', 'good', 'average', 'below_average'][array_rand(['excellent', 'good', 'average', 'below_average'])],
                            'is_language_mandatory' => (bool) rand(0, 1),
                            'language_requirements' => 'IELTS 6.0 or equivalent',
                            'additional_info' => 'Additional info for course.',
                            'course_categories' => $categories,
                            'modules' => ['Module 1', 'Module 2'],
                            'intake_month' => ['January', 'September'],
                            'created_at' => $now,
                            'updated_at' => $now,
                        ]);
                    }
                }
            } else {
                $this->command->warn('Rep country already exists for: '.Country::find($data['country_id'])->name);
            }
        }

        // Create 4 branches with 3 counsellors each (only if they don't exist)
        if (Branch::count() === 0) {
            $this->createBranchesAndCounsellors($countries, $timeZones);
        } else {
            $this->command->info('Branches already exist, skipping branch creation.');
        }

        // Create 4 processing offices (only if they don't exist)
        if (ProcessingOffice::count() === 0) {
            $this->createProcessingOffices($countries, $timeZones);
        } else {
            $this->command->info('Processing offices already exist, skipping processing office creation.');
        }

        $this->command->info('RepCountrySeeder completed successfully!');
    }

    /**
     * Create branches and counsellors
     */
    private function createBranchesAndCounsellors($countries, $timeZones): void
    {
        $branchNames = ['Main Branch', 'North Branch', 'South Branch', 'East Branch'];
        $counsellorNames = [
            ['John Smith', 'Sarah Johnson', 'Michael Brown'],
            ['Emily Davis', 'David Wilson', 'Lisa Anderson'],
            ['Robert Taylor', 'Jennifer Martinez', 'Christopher Garcia'],
            ['Amanda Rodriguez', 'James Lee', 'Michelle White']
        ];

        for ($i = 0; $i < 4; $i++) {
            $country = $countries->random();
            $timeZone = $timeZones->random();

            // Check if branch user already exists
            $branchEmail = 'branch' . ($i + 1) . '@example.com';
            $existingBranchUser = User::where('email', $branchEmail)->first();

            if ($existingBranchUser) {
                $this->command->warn('Branch user already exists: ' . $branchEmail);
                continue;
            }

            // Create branch user
            $branchUser = User::create([
                'name' => $branchNames[$i] . ' Manager',
                'email' => 'branch' . ($i + 1) . '@example.com',
                'password' => Hash::make('password'),
                'phone' => '+1-555-' . str_pad((string) rand(100, 999), 3, '0', STR_PAD_LEFT),
                'mobile' => '+1-555-' . str_pad((string) rand(100, 999), 3, '0', STR_PAD_LEFT),
                'whatsapp' => '+1-555-' . str_pad((string) rand(100, 999), 3, '0', STR_PAD_LEFT),
                'download_csv' => 'allowed',
                'is_active' => true,
            ]);

            $branchUser->assignRole(TenantRolesEnum::BRANCHOFFICE->value);

            // Create branch
            $branch = Branch::create([
                'name' => $branchNames[$i],
                'address' => (string) rand(100, 9999) . ' ' . ['Main St', 'Oak Ave', 'Pine Rd', 'Elm Blvd'][rand(0, 3)],
                'city' => ['New York', 'Los Angeles', 'Chicago', 'Houston'][$i],
                'state' => ['NY', 'CA', 'IL', 'TX'][$i],
                'country_id' => $country->id,
                'time_zone_id' => $timeZone->id,
                'phone' => '+1-555-' . str_pad((string) rand(100, 999), 3, '0', STR_PAD_LEFT),
                'website' => 'https://branch' . ($i + 1) . '.example.com',
                'email' => 'info@branch' . ($i + 1) . '.example.com',
                'user_id' => $branchUser->id,
                'is_active' => true,
            ]);

            $this->command->info('Created branch: ' . $branch->name);

            // Create 3 counsellors for this branch
            for ($j = 0; $j < 3; $j++) {
                $counsellorEmail = 'counsellor' . ($i + 1) . ($j + 1) . '@example.com';
                $existingCounsellorUser = User::where('email', $counsellorEmail)->first();

                if ($existingCounsellorUser) {
                    $this->command->warn('Counsellor user already exists: ' . $counsellorEmail);
                    continue;
                }

                $counsellorUser = User::create([
                    'name' => $counsellorNames[$i][$j],
                    'email' => 'counsellor' . ($i + 1) . ($j + 1) . '@example.com',
                    'password' => Hash::make('password'),
                    'phone' => '+1-555-' . str_pad((string) rand(100, 999), 3, '0', STR_PAD_LEFT),
                    'mobile' => '+1-555-' . str_pad((string) rand(100, 999), 3, '0', STR_PAD_LEFT),
                    'whatsapp' => '+1-555-' . str_pad((string) rand(100, 999), 3, '0', STR_PAD_LEFT),
                    'download_csv' => ['allowed', 'allowed_without_contact', 'not_allowed'][rand(0, 2)],
                    'is_active' => true,
                ]);

                $counsellorUser->assignRole(TenantRolesEnum::COUNSELLOR->value);

                $counsellor = Counsellor::create([
                    'user_id' => $counsellorUser->id,
                    'branch_id' => $branch->id,
                    'as_processing_officer' => (bool) rand(0, 1),
                    'is_active' => true,
                ]);

                $this->command->info('Created counsellor: ' . $counsellorUser->name . ' for branch: ' . $branch->name);
            }
        }
    }

    /**
     * Create processing offices
     */
    private function createProcessingOffices($countries, $timeZones): void
    {
        $processingOfficeNames = ['Central Processing', 'North Processing', 'South Processing', 'East Processing'];
        $contactNames = ['Alex Thompson', 'Maria Garcia', 'Kevin Chen', 'Rachel Kim'];

        for ($i = 0; $i < 4; $i++) {
            $country = $countries->random();
            $timeZone = $timeZones->random();

            // Check if processing office user already exists
            $processingEmail = 'processing' . ($i + 1) . '@example.com';
            $existingProcessingUser = User::where('email', $processingEmail)->first();

            if ($existingProcessingUser) {
                $this->command->warn('Processing office user already exists: ' . $processingEmail);
                continue;
            }

            // Create processing office user
            $processingUser = User::create([
                'name' => $contactNames[$i],
                'email' => 'processing' . ($i + 1) . '@example.com',
                'password' => Hash::make('password'),
                'designation' => 'Processing Manager',
                'phone' => '+1-555-' . str_pad((string) rand(100, 999), 3, '0', STR_PAD_LEFT),
                'mobile' => '+1-555-' . str_pad((string) rand(100, 999), 3, '0', STR_PAD_LEFT),
                'skype' => 'processing' . ($i + 1),
                'download_csv' => 'allowed',
                'is_active' => true,
            ]);

            $processingUser->assignRole(TenantRolesEnum::PROCESSINGOFFICE->value);

            // Create processing office
            $processingOffice = ProcessingOffice::create([
                'name' => $processingOfficeNames[$i],
                'address' => (string) rand(100, 9999) . ' ' . ['Processing St', 'Visa Ave', 'Document Rd', 'Application Blvd'][rand(0, 3)],
                'city' => ['Miami', 'Seattle', 'Denver', 'Atlanta'][$i],
                'state' => ['FL', 'WA', 'CO', 'GA'][$i],
                'country_id' => $country->id,
                'time_zone_id' => $timeZone->id,
                'phone' => '+1-555-' . str_pad((string) rand(100, 999), 3, '0', STR_PAD_LEFT),
                'user_id' => $processingUser->id,
                'is_active' => true,
            ]);

            $this->command->info('Created processing office: ' . $processingOffice->name);
        }
    }
}
