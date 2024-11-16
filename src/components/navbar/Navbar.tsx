"use client";
import React, { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import { useNavbar } from "@/context/NavbarContext";
import Icon from "../icon/Icon";
import api from "@/services/api.service";
import { API_URL } from "@/app/globals";

type IUser = {
  createdAt: string;
  email: string;
  id: number;
  imageURL: string | null;
  username: string;
};

type IProps = {
  user: IUser | undefined;
};

export default function Navbar({ user }: IProps) {
  const { isActive, toggle } = useNavbar();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [invites, setInvites] = useState([]);
  useState(() => {
    (async () => {
      const inviteList = await api.get(`${API_URL}/invite`);
      setInvites(inviteList.data);
    })();
  });

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

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
          <div className="absolute top-12 right-0 bg-[#1a1a1a] text-slate-200 w-96 rounded shadow-lg">
            <ul>
              {invites.map((invite: any, index) => (
                <li
                  className="py-2 hover:bg-[#333] cursor-pointer"
                  key={index}
                >
                  Você foi convidado(a) para a área de trabalho:
                  {invite.workarea.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
