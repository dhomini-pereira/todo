import React, { Fragment } from "react";

type IPaginator = {
  totalPages: number;
  page: number;
  setPage: (page: number) => void;
};

export default function Paginator({ totalPages, page, setPage }: IPaginator) {
  return (
    <div className="flex justify-center">
      <div className="join">
        <button
          className={`join-item btn ${page == 1 ? "btn-disabled" : ""}`}
          onClick={() => {
            if (page !== 1) setPage(page - 1);
          }}
        >
          «
        </button>
        <button className="join-item btn">Page {page}</button>
        <button
          className={`join-item btn ${
            page >= totalPages ? "btn-disabled" : ""
          }`}
          onClick={() => {
            if (page < totalPages) setPage(page + 1);
          }}
        >
          »
        </button>
      </div>
    </div>
  );
}
