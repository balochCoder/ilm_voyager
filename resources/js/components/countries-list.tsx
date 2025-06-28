import { Alert, AlertDescription } from '@/components/ui/alert';
import { Country } from '@/types';

interface CountriesListProps {
    countries: Country[];
}

export default function CountriesList({ countries }: CountriesListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {countries.map((country, index) => (
                <Alert key={country.id} className="flex items-center justify-between">
                    <AlertDescription className="flex items-center gap-2">
                        <span className="font-medium">{index + 1}.</span>
                        <span>{country.name}</span>
                    </AlertDescription>
                    <div className="w-8 h-6 flex items-center justify-center">
                        <img
                            src={country.flag}
                            alt={`${country.name} flag`}
                            className="h-6 w-auto object-contain"
                            loading="lazy"
                        />
                    </div>
                </Alert>
            ))}
        </div>
    );
}
