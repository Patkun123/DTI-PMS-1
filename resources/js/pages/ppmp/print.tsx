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
            className="mx-auto text-[2px] font-sans ml-1"
            style={{ width: "100%", maxWidth: "1100px" }}
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
          <div className="overflow-x-auto border-1 border-black h-100">
            <table className="w-full border-collapse text-[8px]">
              <thead>
                <tr className="bg-gray-100">
                  <th colSpan={5} className="border border-black py-2 px-1 font-bold">PROCUREMENT PROJECT DETAILS</th>
                  <th colSpan={3} className="border border-black py-2 px-1 font-bold">PROJECTED TIMELINE (MM/YYYY)</th>
                  <th colSpan={2} className="border border-black py-2 px-1 font-bold">FUNDING DETAILS</th>
                  <th className="border-t border-black py-2 px-1 font-bold">ATTACHED SUPPORTING DOCUMENTS</th>
                  <th className="border-t border-l border-black py-2 px-1 font-bold">Remarks</th>
                  <th className="border border-black py-2 px-1 font-bold">PPMP Reference No.</th>
                </tr>
                <tr className="bg-gray-100">
                  <th className="border border-black px-1 py-2 text-[7px] font-semibold">General Description and Objective of the Project to be Procured</th>
                  <th className="border border-black px-1 py-2 text-[7px] font-semibold">Type of Project to be Procured</th>
                  <th className="border border-black px-1 py-2 text-[7px] font-semibold">Quantity and Size</th>
                  <th className="border border-black px-1 py-2 text-[7px] font-semibold">Recommended Mode</th>
                  <th className="border border-black px-1 py-2 text-[7px] font-semibold">PPC (Yes/No)</th>
                  <th className="border border-black px-1 py-2 text-[7px] font-semibold">Start Activity</th>
                  <th className="border border-black px-1 py-2 text-[7px] font-semibold">End Activity</th>
                  <th className="border border-black px-1 py-2 text-[7px] font-semibold">Expected Delivery</th>
                  <th className="border border-black px-1 py-2 text-[7px] font-semibold">Source of Funds</th>
                  <th className="border border-black px-1 py-2 text-[7px] font-semibold">Estimated Budget (Php)</th>
                  <th className="px-1 py-2 text-[7px] font-semibold"></th>
                  <th className="border-l border-black px-1 py-2 text-[7px] font-semibold"></th>
                  <th className="border border-black px-1 py-2 text-[7px] font-semibold">Reference No.</th>
                </tr>
              </thead>
              <tbody>
                {props.ppmp?.details?.length ? (
                props.ppmp.details.map((detail: any, di: number) => {
                    const itemCount = detail.items?.length || 0;
                    return detail.items?.map((it: any, ii: number) => (
                    <tr key={`${detail.id}-${it.id || ii}`} className="border-b border-black">
                        {ii === 0 && (
                        <td
                            rowSpan={itemCount}
                            className="border border-black px-2 py-2 text-left align-top"
                        >
                            {detail.general_description}
                        </td>
                        )}
                        <td className="border border-black px-1 py-2 text-center">{it.type_project}</td>
                        <td className="border border-black px-1 py-2 text-center">{it.qty_size}</td>
                        <td className="border border-black px-1 py-2 text-center">{it.recommended}</td>
                        <td className="border border-black px-1 py-2 text-center">{it.ppc}</td>
                        <td className="border border-black px-1 py-2 text-center">{it.start_activity}</td>
                        <td className="border border-black px-1 py-2 text-center">{it.end_activity}</td>
                        <td className="border border-black px-1 py-2 text-center">{it.expected_delivery}</td>
                        <td className="border border-black px-1 py-2 text-center">{it.source_funds}</td>
                        <td className="border border-black px-1 py-2 text-right">
                          {Number(it.estimated_budget).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                        </td>
                        <td className="border border-black px-1 py-2 text-center text-[7px]">{it.attached_support}</td>
                        <td className="border border-black px-1 py-2 text-center">{it.remarks}</td>
                        <td className="border border-black px-1 py-2 text-center">{it.ppmp_ref}</td>
                      </tr>
                    ));
                  })
                ) : (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-black h-12">
                      {Array.from({ length: 13 }).map((_, j) => (
                        <td key={j} className="border border-black"></td>
                      ))}
                    </tr>
                  ))
                )}
                <tr className="font-bold bg-gray-50">
                  <td colSpan={9} className="border border-black text-right pr-3 py-2">TOTAL BUDGET:</td>
                  <td className="border border-black text-right pr-2 py-2">
                    {props.ppmp ? Number(props.ppmp.total).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) : ''}
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
    </>
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
