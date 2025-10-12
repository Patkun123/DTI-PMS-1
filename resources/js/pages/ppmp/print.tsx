import React from "react";
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Printer, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PrintLayout() {
      const handlePrint = () => {
    window.print();
  };
  return (
    <div className="w-full p-6 bg-white text-black">
        <div className="flex justify-end mb-4 no-print">
        <Button
          onClick={handlePrint}
          className="flex items-center gap-2 print:hidden"
        >
          <Printer size={16} />
          Print
        </Button>
      </div>
        {/* --- PAGE WRAPPER --- */}
        <div
            className="mx-auto text-[2px] font-sans ml-1"
            style={{ width: "100%", maxWidth: "1100px" }}
        >
            {/* HEADER */}
            <div className="flex flex-col items-center text-center py-2">
            {/* Center Logo */}
            <img
                src="/images/dtilogo.png"
                alt="DTI Logo"
                className="h-12 mb-1 object-contain"
            />

            {/* Title Section */}
            <p className="font-bold text-lg mb-3">
                PROJECT PROCUREMENT MANAGEMENT PLAN (PPMP) NO. _____
            </p>

            {/* Checkbox Section */}
            <div className="flex gap-6 text-sm">
                <label className="flex items-center gap-1">
                <input type="checkbox" /> INDICATIVE
                </label>
                <label className="flex items-center gap-1">
                <input type="checkbox" /> FINAL
                </label>
            </div>
            </div>

            {/* META INFO */}
            <div className="px-4 py-2 text-xs">
            <p>
                <b>Fiscal Year:</b>
            </p>
            <p>
                <b>End-User or Implementing Unit:</b>
            </p>
            </div>

            {/* TABLE */}
            <table className="w-full border-collapse text-center text-[9px] ">
            <thead>
                <tr className=" bg-gray-100">
                <th colSpan={5} className="border border-black py-1">
                    PROCUREMENT PROJECT DETAILS
                </th>
                <th colSpan={3} className="border border-black py-1">
                    PROJECTED TIMELINE (MM/YYYY)
                </th>
                <th colSpan={2} className="border border-black py-1">
                    FUNDING DETAILS
                </th>
                <th className="border-t border-black py-1"></th>
                <th className="border-l border-r border-t border-black py-1"></th>
                <th className="border-r border-t border-black py-1 w-[90px]">
                </th>
                </tr>
                <tr className="bg-gray-100">
                <th className="border border-black px-2 p-2">General Description and Objective of the Project to be Procured</th>
                <th className="border border-black px-2">
                    Type of Project to be Procured (whether Goods, Infrastructure and Consulting Services)
                </th>
                <th className="border border-black px-2">
                    Quantity and Size of the Project to be Procured
                </th>
                <th className="border border-black px-2">
                    Recommended Mode of Procurement
                </th>
                <th className="border border-black px-2">
                    Pre-Procurement Conference, if applicable (Yes/No)
                </th>
                <th className="border border-black px-2">Start of Procurement Activity</th>
                <th className="border border-black px-2">End of Procurement Activity</th>
                <th className="border border-black px-2">
                    Expected Delivery/Implementation Period
                </th>
                <th className="border border-black px-2">Source of Funds</th>
                <th className="border border-black px-2">
                    Estimated Budget / Authorized Budgetary Allocation (Php)
                </th>
                <th className="border-t px-2 align-top">ATTACHED SUPPORTING DOCUMENTS</th>
                <th className="border-r border-l border-black px-2 align-top">Remarks</th>
                <th className="border-r border-black px-2 align-top">PPMP Reference No.</th>
                </tr>
            </thead>
            <tbody>
                {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-black h-[40px]">
                    {Array.from({ length: 13 }).map((_, j) => (
                    <td key={j} className="border border-black"></td>
                    ))}
                </tr>
                ))}
                <tr className="font-bold">
                <td colSpan={9} className="border border-black text-right pr-2">
                    TOTAL BUDGET:
                </td>
                <td className="border border-black"></td>
                <td colSpan={3} className="border border-black"></td>
                </tr>
            </tbody>
            </table>

            {/* FOOTER */}
            <div className="flex justify-center gap-50 text-xs mt-3 px-4 py-2">
                <div className="text-center">
                    <div className="text-start mb-10">Prepared by:</div>
                    <div className="w-80 border-t border-black mb-2"></div>
                    <div className="">Signature over Printed Name </div>
                    <div className="">Position/Designation</div>
                    <div className="">[Head of the End-User or Implementing Unit]</div>
                    <div className="text-start mt-2">Date: ___________</div>

                </div>
                <div className="text-center">
                    <div className="text-start mb-10">Submitted by:</div>
                    <div className="w-80 border-t border-black mb-2"></div>
                    <div className="">Signature over Printed Name </div>
                    <div className="">Position/Designation</div>
                    <div>[Head of the End-User or Implementing Unit]</div>
                    <div className="text-start mt-2">Date: ___________</div>
                </div>
            </div>
        </div>
        </div>
    );
}
<style>{`
    @media print {
        @page {
            size: Legal landscape;
            margin: 0;
        }

        body {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
        }

        .no-print {
            display: none !important;
        }
    }
    `}

</style>
