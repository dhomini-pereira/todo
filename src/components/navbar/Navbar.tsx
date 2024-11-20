"use client";
import React, { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import { useNavbar } from "@/context/NavbarContext";
import Icon from "../icon/Icon";
import api from "@/services/api.service";
import { API_URL } from "@/app/globals";
import { toast } from "react-toastify";

type IUser = {
  createdAt: string;
  email: string;
  id: number;
  imageURL: string | null;
  username: string;
};

type IInvite = {
  workareaId: number;
  userId: number;
  workarea: {
    name: string;
  };
};

type IProps = {
  user: IUser | undefined;
};

export default function Navbar({ user }: IProps) {
  const { isActive, toggle } = useNavbar();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [invites, setInvites] = useState<IInvite[]>([]);
  useState(() => {
    (async () => {
      const inviteList = await api.get(`${API_URL}/invite`);
      setInvites(inviteList.data);
    })();
  });

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
  const handleReject = async (id: number) => {
    try {
      const url = `${API_URL}/invite`;
      await api.post(url, { workareaId: id, accepted: false });

      setInvites((prev) => prev.filter((invite) => invite.workareaId !== id));
      toggleDropdown();
    } catch (err: any) {
      toast.error(err.response.data.error);
    }
  };

  const handleAccept = async (id: number) => {
    try {
      const url = `${API_URL}/invite`;
      await api.post(url, { workareaId: id, accepted: true });

      setInvites((prev) => prev.filter((invite) => invite.workareaId !== id));
      toggleDropdown();
    } catch (err: any) {
      toast.error(err.response.data.error);
    }
  };

  return (
    <div className="bg-[#0A070E] w-screen text-slate-200 h-12 text-lg flex items-center justify-between pl-4 pr-10">
      <div className="w-fit flex items-center sm:gap-10">
        <Sidebar MenuIsActive={isActive} handle={toggle} />
        <h1>ToDo App</h1>
      </div>

      <div className="relative w-fit flex items-center gap-3 text-base">
        <h2>{user?.username || "Unknown"}</h2>
        {user?.imageURL ? (
          <img
            src={user?.imageURL}
            alt={user?.username}
            className="h-9 w-9 object-cover rounded-full cursor-pointer"
          />
        ) : (
          <Icon iconName="profile" className="h-9 cursor-pointer" />
        )}
        <Icon
          iconName="notification"
          className={`size-6 ${invites.length > 0 ? "cursor-pointer" : ""}`}
          onClick={() => {
            if (invites.length) {
              toggleDropdown();
            }
          }}
        />

        {isDropdownOpen && (
          <div className="absolute top-12 right-0 bg-slate-800 w-[400px] p-[10px] flex justify-between items-center rounded-[10px]">
            <ul>
              {invites.map((invite: any, index) => (
                <li className="flex flex-row gap-3 items-center" key={index}>
                  <div className="flex flex-col gap-3">
                    <div>Você foi convidado(a) para a área de trabalho:</div>
                    <div className="font-bold">{invite.workarea.name}</div>
                  </div>
                  <div className="flex flex-row gap-3">
                    <Icon
                      iconName="check"
                      className="size-6 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAccept(invite.workareaId);
                      }}
                    />
                    <Icon
                      iconName="close"
                      className="size-6 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        handleReject(invite.workareaId);
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
