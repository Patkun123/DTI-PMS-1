import { Head, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { useEffect } from 'react';
import React from 'react';

export default function PrintLayout() {
  const { props }: any = usePage();

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get('autoprint') === '1') {
      setTimeout(() => window.print(), 300);
    }
  }, []);

  return (
    <>
      <div className="w-full bg-white text-black">
        <div className="absolute bottom-0 left-0 right-0 mb-4 no-print p-6 flex justify-end">
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <Printer size={16} />
            Print
          </Button>
        </div>

        <div
            className="mx-auto text-[2px] font-sans ml-30 mt-20"
            style={{ width: "100%", maxWidth: "1200px" }}
        >
          {/* HEADER */}
          <div className="flex flex-col items-center text-center">
            <img src="/images/dtilogo.png" alt="DTI Logo" className="h-12 mb-1 object-contain" />
            <p className="font-bold text-base mb-3">
              PROJECT PROCUREMENT MANAGEMENT PLAN (PPMP) NO. {props.ppmp?.ppmp_no ?? '_____'}
            </p>
            <div className="flex gap-6 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" /> INDICATIVE
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" /> FINAL
              </label>
            </div>
          </div>

          {/* META INFO */}
          <div className="px-4 py-3 text-sm space-y-1">
            <p><b>Fiscal Year:</b> {props.ppmp ? new Date(props.ppmp.created_at).getFullYear() : ''}</p>
            <p><b>End-User or Implementing Unit:</b> {props.ppmp?.division ?? ''}</p>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto border-1 border-black">
            <table className="w-full border-collapse text-[8px] print:text-[7px]">
              <thead>
                <tr className="bg-gray-100 print:bg-white">
                  <th colSpan={5} className="border border-black py-2 px-1 font-bold text-[9px] print:text-[8px]">
                    PROCUREMENT PROJECT DETAILS
                  </th>
                  <th colSpan={3} className="border border-black py-2 px-1 font-bold text-[9px] print:text-[8px]">
                    PROJECTED TIMELINE (MM/YYYY)
                  </th>
                  <th colSpan={2} className="border border-black py-2 px-1 font-bold text-[9px] print:text-[8px]">
                    FUNDING DETAILS
                  </th>
                  <th className="border-t border-black py-2 px-1 font-bold text-[9px] print:text-[8px]">
                    ATTACHED SUPPORTING DOCUMENTS
                  </th>
                  <th className="border-t border-l border-black py-2 px-1 font-bold text-[9px] print:text-[8px]">
                    Remarks
                  </th>
                  <th className="border border-black py-2 px-1 font-bold text-[9px] print:text-[8px]">
                    PPMP Reference No.
                  </th>
                </tr>
                <tr className="bg-gray-100 print:bg-white">
                  <th className="border border-black px-1 py-1.5 text-[7px] print:text-[6px] font-semibold w-[15%]">
                    General Description and Objective of the Project to be Procured
                  </th>
                  <th className="border border-black px-1 py-1.5 text-[7px] print:text-[6px] font-semibold w-[8%]">
                    Type of Project to be Procured
                  </th>
                  <th className="border border-black px-1 py-1.5 text-[7px] print:text-[6px] font-semibold w-[7%]">
                    Quantity and Size
                  </th>
                  <th className="border border-black px-1 py-1.5 text-[7px] print:text-[6px] font-semibold w-[8%]">
                    Recommended Mode
                  </th>
                  <th className="border border-black px-1 py-1.5 text-[7px] print:text-[6px] font-semibold w-[5%]">
                    PPC (Yes/No)
                  </th>
                  <th className="border border-black px-1 py-1.5 text-[7px] print:text-[6px] font-semibold w-[7%]">
                    Start Activity
                  </th>
                  <th className="border border-black px-1 py-1.5 text-[7px] print:text-[6px] font-semibold w-[7%]">
                    End Activity
                  </th>
                  <th className="border border-black px-1 py-1.5 text-[7px] print:text-[6px] font-semibold w-[7%]">
                    Expected Delivery
                  </th>
                  <th className="border border-black px-1 py-1.5 text-[7px] print:text-[6px] font-semibold w-[8%]">
                    Source of Funds
                  </th>
                  <th className="border border-black px-1 py-1.5 text-[7px] print:text-[6px] font-semibold w-[9%]">
                    Estimated Budget (Php)
                  </th>
                  <th className="px-1 py-1.5 text-[7px] print:text-[6px] font-semibold w-[8%]"></th>
                  <th className="border-l border-black px-1 py-1.5 text-[7px] print:text-[6px] font-semibold w-[6%]"></th>
                  <th className="border border-black px-1 py-1.5 text-[7px] print:text-[6px] font-semibold w-[5%]">
                    Reference No.
                  </th>
                </tr>
              </thead>
              <tbody>
                {props.ppmp?.details?.length ? (
                  props.ppmp.details.map((detail: any, di: number) => {
                    const itemCount = detail.items?.length || 0;
                    return (
                      <React.Fragment key={detail.id}>
                        {/* Header row with general description */}
                        <tr className="border-b border-black">
                          <td
                            colSpan={13}
                            className="border border-black px-1.5 py-1.5 text-left font-bold text-[7px] print:text-[6px] bg-gray-50 print:bg-gray-100"
                          >
                            {detail.general_description}
                          </td>
                        </tr>
                        {/* Item rows */}
                        {detail.items?.map((it: any, ii: number) => (
                          <tr key={`${detail.id}-${it.id || ii}`} className="border-b border-black print:break-inside-avoid">
                            <td className="border border-black px-1.5 py-1.5 text-left text-[7px] print:text-[6px]">
                              {it.detail}
                            </td>
                            <td className="border border-black px-1 py-1.5 text-center text-[7px] print:text-[6px]">
                              {it.type_project}
                            </td>
                            <td className="border border-black px-1 py-1.5 text-center text-[7px] print:text-[6px]">
                              {it.qty_size}
                            </td>
                            <td className="border border-black px-1 py-1.5 text-center text-[7px] print:text-[6px]">
                              {it.recommended}
                            </td>
                            <td className="border border-black px-1 py-1.5 text-center text-[7px] print:text-[6px]">
                              {it.ppc}
                            </td>
                            <td className="border border-black px-1 py-1.5 text-center text-[7px] print:text-[6px]">
                              {it.start_activity}
                            </td>
                            <td className="border border-black px-1 py-1.5 text-center text-[7px] print:text-[6px]">
                              {it.end_activity}
                            </td>
                            <td className="border border-black px-1 py-1.5 text-center text-[7px] print:text-[6px]">
                              {it.expected_delivery}
                            </td>
                            <td className="border border-black px-1 py-1.5 text-center text-[7px] print:text-[6px]">
                              {it.source_funds}
                            </td>
                            <td className="border border-black px-1 py-1.5 text-right text-[7px] print:text-[6px]">
                              {Number(it.estimated_budget).toLocaleString('en-PH', {
                                style: 'currency',
                                currency: 'PHP'
                              })}
                            </td>
                            <td className="border border-black px-1 py-1.5 text-center text-[6px] print:text-[5px]">
                              {it.attached_support}
                            </td>
                            <td className="border border-black px-1 py-1.5 text-center text-[7px] print:text-[6px]">
                              {it.remarks}
                            </td>
                            <td className="border border-black px-1 py-1.5 text-center text-[7px] print:text-[6px]">
                              {it.ppmp_ref}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })
                ) : (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-black h-10 print:h-8">
                      {Array.from({ length: 13 }).map((_, j) => (
                        <td key={j} className="border border-black"></td>
                      ))}
                    </tr>
                  ))
                )}
                <tr className="font-bold bg-gray-50 print:bg-white">
                  <td colSpan={9} className="border border-black text-right pr-3 py-2 text-[8px] print:text-[7px]">
                    TOTAL BUDGET:
                  </td>
                  <td className="border border-black text-right pr-2 py-2 text-[8px] print:text-[7px]">
                    {props.ppmp ?
                      Number(props.ppmp.total).toLocaleString('en-PH', {
                        style: 'currency',
                        currency: 'PHP'
                      }) : ''
                    }
                  </td>
                  <td colSpan={3} className="border border-black"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="flex justify-around text-xs mt-8 px-4 py-4">
            <div className="text-center">
              <div className="text-left mb-16">Prepared by:</div>
              <div className="w-64 border-t border-black mb-2"></div>
              <div>Signature over Printed Name</div>
              <div>Position/Designation</div>
              <div>[Head of the End-User or Implementing Unit]</div>
              <div className="text-left mt-3">Date: ___________</div>
            </div>
            <div className="text-center">
              <div className="text-left mb-16">Submitted by:</div>
              <div className="w-64 border-t border-black mb-2"></div>
              <div>Signature over Printed Name</div>
              <div>Position/Designation</div>
              <div>[Head of the End-User or Implementing Unit]</div>
              <div className="text-left mt-3">Date: ___________</div>
            </div>
          </div>
        </div>
      </div>

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

          table {
            page-break-inside: auto;
          }

          thead {
            display: table-header-group;
          }

          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }

          td, th {
            padding: 2px 4px !important;
          }
        }
      `}</style>
    </>
  );
}
