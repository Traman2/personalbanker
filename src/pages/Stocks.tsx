import axios from "axios";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card.tsx";

// Define interfaces
interface Dividend {
    cash_amount: number;
    currency: string;
    dividend_type: string;
    ex_dividend_date: string;
    frequency: number;
}

interface DividendsResponse {
    results: Dividend[];
    status: string;
    request_id: string;
    next_url?: string;
}

function Stocks() {
    const [getData, setGetData] = useState<Dividend[] | null>(null); // Use the Dividend[] type

    useEffect(() => {
        axios.get<DividendsResponse>('https://api.polygon.io/v3/reference/dividends', {
            params: {
                apiKey: 'UhZd5ppXnyaIGhD32Ju8fMNmmw1Y7kpX'
            }
        })
            .then(response => {
                console.log(response.data);
                setGetData(response.data.results); // Safe to use results because we typed the response
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    return (
        <div className="flex flex-wrap justify-center gap-4 p-4">
            {getData ? (
                getData.map((dividend, index) => (
                    <Card key={index} className="w-80">
                        <CardHeader>
                            <h2 className="text-xl font-semibold">Dividend Details</h2>
                        </CardHeader>
                        <CardContent>
                            <p><strong>Cash Amount:</strong> {dividend.cash_amount}</p>
                            <p><strong>Currency:</strong> {dividend.currency}</p>
                            <p><strong>Dividend Type:</strong> {dividend.dividend_type}</p>
                            <p><strong>Ex-Dividend Date:</strong> {dividend.ex_dividend_date}</p>
                            <p><strong>Frequency:</strong> {dividend.frequency}</p>
                        </CardContent>
                        <CardFooter>
                            <p className="text-sm text-gray-500">Source: Polygon.io</p>
                        </CardFooter>
                    </Card>
                ))
            ) : (
                <p>No data found</p>
            )}
        </div>
    );
}

export default Stocks;
