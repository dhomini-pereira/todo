import React from "react";

enum Status {
  CANCELED = "CANCELED",
  PENDING = "PENDING",
  DONE = "DONE",
}

type TodoList = {
  id: number;
  title: string;
  description?: string;
  status: Status;
  createdAt: Date;
};

type ITable = {
  tasks: Array<TodoList>;
  changeStatus: (id: number, status: Status) => void;
};

export default function Table({ tasks, changeStatus }: ITable) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Status</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td>
              <div className="flex items-center gap-3">
                <div className="font-bold">{task.title}</div>
              </div>
            </td>
            <td>{task.description}</td>
            <td>
              <label className="form-control w-3/6">
                <select
                  className={`select text-xs btn-sm ${
                    task.status === "DONE"
                      ? "select-success"
                      : task.status === "CANCELED"
                      ? "select-error"
                      : "select-warning"
                  }`}
                  defaultValue={task.status}
                  onChange={async (e) => {
                    e.preventDefault();
                    await changeStatus(
                      task.id,
                      e.target.value.valueOf() as Status
                    );
                  }}
                >
                  <option value={Status.CANCELED}>CANCELED</option>
                  <option value={Status.PENDING}>PENDING</option>
                  <option value={Status.DONE}>DONE</option>
                </select>
              </label>
            </td>
            <th>
              <button className="btn btn-ghost btn-xs">
                {new Date(task.createdAt).toDateString()}
              </button>
            </th>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
