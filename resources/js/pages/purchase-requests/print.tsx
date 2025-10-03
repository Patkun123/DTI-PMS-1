import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Printer, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PurchaseRequest {
    id: number;
    pr_number: string;
    stock_no: number;
    item_description: string;
    quantity: number;
    unit_cost: number;
    total_cost: number;
    status: 'pending' | 'approved';
    requested_date: string;
    user: {
        name: string;
        email: string;
        requester: string;
        position: string;
    };
    created_at: string;
    updated_at: string;
}

interface Props {
    purchaseRequest: PurchaseRequest;
}

export default function Print({ purchaseRequest }: Props) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Check if dark mode is enabled
        const isDark = document.documentElement.classList.contains('dark') ||
                      (localStorage.getItem('theme') === 'dark') ||
                      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setIsDarkMode(isDark);
    }, []);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);

        if (newMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Head title={`Print - ${purchaseRequest.pr_number}`} />

            {/* Print Button and Dark Mode Toggle - Hidden when printing */}
            <div className="fixed top-4 right-4 z-10 print:hidden flex gap-2">
                <Button onClick={handlePrint} className="shadow-lg">
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                </Button>
            </div>

            {/* Print Layout */}
            <div className="min-h-screen bg-white dark:bg-zinc-900 p-5 print:p-0 print:m-0 print:paper-size transition-colors duration-300">
                <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-800 print:max-w-none print:mx-0 border-2 border-black dark:border-zinc-600 flex flex-col min-h-full transition-all duration-300">
                    {/* Main Content */}
                    <div className="flex-grow">
                        {/* Header */}
                        <div className="text-center p-4 print:compact-header border-b border-black dark:border-zinc-600 bg-gray-50 dark:bg-zinc-700 transition-colors duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <img src="/images/logo.jpg" alt="DTI Logo" className="w-25 h-16 object-contain relative" />
                                <div className="flex-1 text-center">
                                    <h1 className="text-3xl font-extrabold uppercase tracking-wide text-black dark:text-white">PURCHASE REQUEST</h1>
                                </div>
                                <div className="w-20"></div>
                            </div>
                            <div className="grid grid-cols-2">
                                <div className="text-left ">
                                    <span className="text-md text-black dark:text-white">Entity Name: Department of Trade and Industry - XII</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-md text-black dark:text-white">Fund Cluster: 101101</span>
                                </div>
                            </div>
                        </div>

                        {/* Form Details */}
                        <div className="p-3 print:compact text-sm space-y-2 bg-white dark:bg-zinc-800 transition-colors duration-300">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className="mr-1  text-black dark:text-white">Office/Section:</span>
                                    <span className="flex-1 min-w-[250px] font-semibold text-black dark:text-white">
                                        Administrative, Financial, and Management Division
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <span className="align ml-4 text-black text-sm dark:text-white">PR No.: {purchaseRequest.pr_number}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-black text-sm dark:text-white">Date:</span>
                                    <span className="px-4 min-w-[100px] text-center text-sm text-black dark:text-white">
                                        {new Date(purchaseRequest.requested_date).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="mb-4 bg-white dark:bg-zinc-800 transition-colors duration-300 h-150">
                            <table className="w-full border-collapse text-sm print:compact-table table-fixed" style={{ minHeight: '200' }}>
                                <thead>
                                    <tr className="bg-gray-100 dark:bg-zinc-700">
                                        <th className="border border-black dark:border-zinc-600 p-2 text-center text-black dark:text-white" style={{ width: '10%' }}>Stock No.</th>
                                        <th className="border border-black dark:border-zinc-600 p-2 text-center text-black dark:text-white" style={{ width: '8%' }}>Unit</th>
                                        <th className="border border-black dark:border-zinc-600 p-2 text-center text-black dark:text-white" style={{ width: '50%' }}>Item Description</th>
                                        <th className="border border-black dark:border-zinc-600 p-2 text-center text-black dark:text-white" style={{ width: '10%' }}>Quantity</th>
                                        <th className="border border-black dark:border-zinc-600 p-2 text-center text-black dark:text-white" style={{ width: '12%' }}>Unit Cost</th>
                                        <th className="border border-black dark:border-zinc-600 p-2 text-center text-black dark:text-white" style={{ width: '10%' }}>Total Cost</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="hover:bg-gray-50 dark:hover:bg-zinc-700 border-black border"  style={{ height: '100%' }}>
                                        <td className="border border-black dark:border-zinc-600 p-2 text-left text-black dark:text-white align-top">{purchaseRequest.stock_no}</td>
                                        <td className="border border-black dark:border-zinc-600 p-2 text-left text-black dark:text-white align-top">pc</td>
                                        <td className="border border-black dark:border-zinc-600 p-2 text-black dark:text-white align-top">
                                            <div className="whitespace-pre-line leading-relaxed h-full flex items-start text-xs">{purchaseRequest.item_description}</div>
                                        </td>
                                        <td className="border border-black dark:border-zinc-600 p-2 text-left text-black dark:text-white align-top">{purchaseRequest.quantity}</td>
                                        <td className="border border-black dark:border-zinc-600 p-2 text-left text-black dark:text-white align-top">{purchaseRequest.unit_cost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                        <td className="border border-black dark:border-zinc-600 p-2 text-left text-black dark:text-white align-top">{purchaseRequest.total_cost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Footer with Purpose and Signatures */}
                    <div className="mt-auto border-t border-black dark:border-zinc-600 print:footer bg-gray-50 dark:bg-zinc-700 transition-colors duration-300">
                        {/* Purpose */}
                        <div className="p-3 border-t border-black dark:border-zinc-600 print:compact text-sm">
                            <div className="flex">
                                <span className="font-semibold mr-2  text-black dark:text-white">Purpose:</span>
                                <div className="flex-1 min-h-[50px] p-1 dark:border-zinc-600 text-xs text-black dark:text-white">
                                    Procurement of items as specified in the purchase request
                                </div>
                            </div>
                        </div>

                        {/* Signature Section */}
                        <div className="grid grid-cols-5 gap-8 print:compact text-sm border border-black dark:border-zinc-600">
                            <div className="col-span-3 border-r p-2 border-black dark:border-zinc-600">
                                <div className="mb-3 font-semibold text-black dark:text-white text-center">Requested By:</div>
                                <div className="grid grid-cols-3 w-full" >
                                    <div className="h-auto w-full">
                                        <p className="text-sm mb-1 text-black dark:text-white">Signature</p>
                                        <p className="text-sm mb-1 text-black dark:text-white">Printed Name:</p>
                                        <p className="text-sm mb-1 text-black dark:text-white">Designation</p>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="text-sm mb-1 text-black dark:text-white">&nbsp;</div>
                                        <span className="text-md font-semibold text-black dark:text-white">{purchaseRequest.user.requester.toUpperCase()}</span><br />
                                        <span className="text-sm text-black dark:text-white">{purchaseRequest.user.position}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-2 p-2 text-center">
                                <div className="mb-3 font-semibold text-black dark:text-white text-start">Approved By:</div>
                                <br />
                                <span className="text-center font-semibold text-sm">FLORA D. POLITUD-GABUNALES, CESO V</span>
                                <span className="text-sm"> Regional Director</span>
                            </div>
                            {/* <div className="text-center">
                                <div className="mb-3 font-semibold text-black dark:text-white">Approved By:</div>
                                <div className="border-b-2 border-black dark:border-zinc-600 mb-2 h-12 flex items-end justify-center pb-1">
                                    <span className="font-semibold text-xs text-black dark:text-white">
                                        {purchaseRequest.status === 'approved' ? 'APPROVED' : 'PENDING'}
                                    </span>
                                </div>
                                <div className="text-xs mb-3 text-black dark:text-white">Signature</div>
                                <div className="border-b border-black dark:border-zinc-600 mb-2 h-6"></div>
                                <div className="text-xs text-black dark:text-white">Printed Name: <span className="font-semibold">Regional Director</span></div>
                                <div className="text-xs text-black dark:text-white">Designation: <span className="font-semibold">Regional Director</span></div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @media print {
                    @page {
                        size: auto;
                        margin: 0;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                        font-size: 11pt;
                        line-height: 1.1;
                        background: white !important;
                        color: black !important;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    .print\\:p-0 {
                        padding: 0 !important;
                    }
                    .print\\:m-0 {
                        margin: 0 !important;
                    }
                    .print\\:max-w-none {
                        max-width: none !important;
                    }
                    .print\\:mx-0 {
                        margin-left: 0 !important;
                        margin-right: 0 !important;
                    }
                    .print\\:paper-size {
                        width: 8.2in;
                        min-height: 11in;
                        height: auto;
                        overflow: visible;
                        transform: scale(0.95);
                        background: white !important;
                        color: black !important;
                    }
                    .print\\:compact {
                        padding: 8px !important;
                    }
                    .print\\:compact-header {
                        padding: 12px !important;
                    }
                    .print\\:compact-table {
                        font-size: 10pt !important;
                    }
                    .print\\:compact-text {
                        font-size: 10pt !important;
                    }
                    .print\\:footer {
                        margin-top: auto !important;
                        page-break-inside: avoid !important;
                    }
                    /* Force white background and black text for print */
                    * {
                        background: white !important;
                        color: black !important;
                        border-color: black !important;
                    }
                    /* Ensure table borders are visible */
                    table, th, td {
                        border: 1px solid black !important;
                        background: white !important;
                        color: black !important;
                    }
                    /* Preserve line breaks and spacing in print */
                    .whitespace-pre-line {
                        white-space: pre-line !important;
                    }
                    .leading-relaxed {
                        line-height: 1.6 !important;
                    }
                    /* Fixed table height for print */
                    table {
                        height: auto !important;
                        min-height: auto !important;
                    }
                    tbody {
                        height: auto !important;
                        min-height: auto !important;
                    }
                    tr {
                        height: 100% !important;
                    }
                    /* Header styling */
                    .bg-gray-50, .bg-zinc-700, .bg-zinc-800, .bg-zinc-900 {
                        background: white !important;
                        color: black !important;
                    }
                    /* Text colors */
                    .text-black, .text-white, .text-zinc-600, .text-zinc-700, .text-zinc-800, .text-zinc-900 {
                        color: black !important;
                    }
                    /* Border colors */
                    .border-black, .border-zinc-600, .border-zinc-700, .border-zinc-800 {
                        border-color: black !important;
                    }
                }

                /* Dark mode styles for screen display */
                @media (prefers-color-scheme: dark) {
                    .dark\\:bg-zinc-900 {
                        background-color: rgb(24 24 27);
                    }
                    .dark\\:bg-zinc-800 {
                        background-color: rgb(39 39 42);
                    }
                    .dark\\:bg-zinc-700 {
                        background-color: rgb(63 63 70);
                    }
                    .dark\\:text-white {
                        color: rgb(255 255 255);
                    }
                    .dark\\:text-zinc-600 {
                        color: rgb(82 82 91);
                    }
                    .dark\\:border-zinc-600 {
                        border-color: rgb(82 82 91);
                    }
                }
            `}</style>
        </>
    );
}
