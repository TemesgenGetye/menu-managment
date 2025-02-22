"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  MenuIcon,
  Folder,
  LayoutDashboard,
  File,
  Search,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { menu, status, error } from "@/store/menuSlice";
import type { AppDispatch } from "@/store/store";
import { fetchMenus, saveMenu } from "@/store/menuThunk";
import { Input } from "@/components/ui/input";
import Loader from "@/components/loader";

interface MenuItem {
  id: string;
  name: string;
  parentId: string | null;
  depth: number;
  type: "root" | "group" | "section" | "item";
  children?: MenuItem[];
}

export default function MenuSystem() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [expandedNav, setExpandedNav] = useState<Set<string>>(new Set());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Redux
  const dispatch = useDispatch<AppDispatch>();
  const menusNew = useSelector(menu);
  const menuStatus = useSelector(status);
  const menuError = useSelector(error);

  useEffect(() => {
    dispatch(fetchMenus());
  }, [dispatch]);

  useEffect(() => {
    if (menusNew && menusNew.length > 0) {
      setMenus(menusNew);
      localStorage.setItem("menus", JSON.stringify(menusNew));
      const allIds = getAllMenuIds(menusNew);
      setExpandedMenus(allIds);
      setExpandedNav(new Set(allIds));
    }
  }, [menusNew]);

  const toggleExpand = (menuId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setExpandedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  const toggleNavExpand = (menuId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setExpandedNav((prev) => {
      const next = new Set(prev);
      if (next.has(menuId)) {
        next.delete(menuId);
      } else {
        next.add(menuId);
      }
      return next;
    });
  };

  const expandAll = () => {
    const allIds = getAllMenuIds(menus);
    setExpandedMenus(allIds);
    setExpandedNav(new Set(allIds));
  };

  const collapseAll = () => {
    setExpandedMenus([]);
    setExpandedNav(new Set());
  };

  const getAllMenuIds = (items: MenuItem[]): string[] => {
    return items.reduce((acc: string[], item) => {
      acc.push(item.id);
      if (item.children) {
        acc.push(...getAllMenuIds(item.children));
      }
      return acc;
    }, []);
  };

  const addNewMenuItem = (parentId: string) => {
    const findParent = (
      items: MenuItem[],
      parentId: string
    ): MenuItem | null => {
      for (const item of items) {
        if (item.id === parentId) return item;
        if (item.children) {
          const found = findParent(item.children, parentId);
          if (found) return found;
        }
      }
      return null;
    };

    const parentItem = findParent(menus, parentId);
    const newDepth = parentItem ? parentItem.depth + 1 : 0;
    const newType: "root" | "group" | "section" | "item" =
      newDepth === 0
        ? "root"
        : newDepth === 1
          ? "group"
          : newDepth === 2
            ? "section"
            : "item";

    const newItem: MenuItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: "New Menu Item",
      parentId: parentId,
      depth: newDepth,
      type: newType,
    };

    const updateMenus = (items: MenuItem[]): MenuItem[] => {
      return items.map((item) => {
        if (item.id === parentId) {
          return {
            ...item,
            children: [...(item.children || []), newItem],
          };
        }
        if (item.children) {
          return {
            ...item,
            children: updateMenus(item.children),
          };
        }
        return item;
      });
    };

    const updatedMenus = updateMenus(menus);
    setMenus(updatedMenus);
    localStorage.setItem("menus", JSON.stringify(updatedMenus));
    setExpandedMenus((prev) => [...prev, parentId]);
  };

  const updateMenuInTree = (
    items: MenuItem[],
    updatedItem: MenuItem
  ): MenuItem[] => {
    return items.map((item) => {
      if (item.id === updatedItem.id) {
        return { ...item, ...updatedItem };
      }
      if (item.children) {
        return {
          ...item,
          children: updateMenuInTree(item.children, updatedItem),
        };
      }
      return item;
    });
  };

  const saveMenuChanges = () => {
    if (selectedMenu) {
      const updatedMenus = updateMenuInTree(menus, selectedMenu);
      setMenus(updatedMenus);
      localStorage.setItem("menus", JSON.stringify(updatedMenus));
      dispatch(saveMenu(selectedMenu));
    }
  };

  const getMenuIcon = (type: string) => {
    switch (type) {
      case "root":
      case "group":
        return <Folder className="h-4 w-4" />;
      case "section":
        return <LayoutDashboard className="h-4 w-4" />;
      case "item":
        return <File className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const renderMenuItem = (item: MenuItem) => {
    const isExpanded = expandedMenus.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const showConnector = item.depth > 0;

    return (
      <div key={item.id} className="relative">
        <div className="group flex items-center gap-2 rounded px-2 py-2 hover:bg-gray-50">
          {/* Vertical connector line */}
          {showConnector && (
            <div
              className="absolute left-[-16px] h-full border-l border-gray-200"
              style={{
                top: "-50%",
              }}
            />
          )}

          {/* Horizontal connector line */}
          {showConnector && (
            <div
              className="absolute left-[-16px] h-[1px] w-4 bg-gray-200"
              style={{
                top: "50%",
              }}
            />
          )}

          <div className="flex items-center gap-2">
            {hasChildren ? (
              <button
                onClick={(e) => toggleExpand(item.id, e)}
                className="flex h-4 w-4 items-center justify-center rounded transition-colors hover:bg-gray-100"
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </button>
            ) : (
              <div className="w-4" />
            )}

            {getMenuIcon(item.type)}

            <span
              className={`cursor-pointer hover:text-blue-600 ${
                selectedMenu?.id === item.id ? "font-medium text-blue-600" : ""
              }`}
              onClick={() => setSelectedMenu(item)}
            >
              {item.name}
            </span>

            <button
              onClick={() => addNewMenuItem(item.id)}
              className="ml-2 text-blue-500 opacity-0 transition-opacity hover:text-blue-700 group-hover:opacity-100"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>

        {isExpanded && item.children && (
          <div className="ml-6">
            {item.children.map((child) => renderMenuItem(child))}
          </div>
        )}
      </div>
    );
  };

  const renderSidebarItem = (item: MenuItem, depth = 0) => {
    const isExpanded = expandedNav.has(item.id);
    const hasChildren = item.children && item.children.length > 0;

    if (item.type === "root") {
      return (
        <>{item.children?.map((child) => renderSidebarItem(child, depth))}</>
      );
    }

    return (
      <div key={item.id} className="space-y-0.5">
        <div
          className={`flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm ${
            selectedMenu?.id === item.id
              ? "bg-primary text-primary-foreground"
              : "text-gray-200 hover:bg-gray-800"
          }`}
          style={{ paddingLeft: `${depth * 12 + 12}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleNavExpand(item.id);
            }
            setSelectedMenu(item);
          }}
        >
          {hasChildren && item.type !== "section" && (
            <span className="flex h-4 w-4 items-center justify-center">
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </span>
          )}

          {getMenuIcon(item.type)}
          <span className="text-sm">{item.name}</span>
        </div>

        {depth < 2 && hasChildren && isExpanded && (
          <div className="space-y-0.5">
            {item.children
              .filter((child) => child.type !== "item")
              .map((child) => renderSidebarItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const filteredMenus = menus.filter((menu) => menu.type === "root");

  return (
    <div className="flex min-h-screenbo">
      {/* Mobile Menu Button */}
      <button
        className="fixed left-6 top-6 z-50 rounded-lg bg-gray-900 p-3 text-white lg:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 z-40 w-72 transform bg-[#14161F]  my-3 mx-4 rounded-2xl transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between  px-6 mt-9">
          <span className="text-xl font-bold text-white">CLOIT</span>
          <button className="text-gray-400 hover:text-white">
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-1 p-4">
          {menuStatus === "loading" ? (
            <div className="flex justify-center py-4">
              <Loader />
            </div>
          ) : (
            menus.map((menu) => renderSidebarItem(menu))
          )}
        </div>
      </div>

      {/* Main Content - updated layout */}
      <div className="flex-1 overflow-auto">
        <div className=" bg-white px-8 py-4">
          <div className="mb-4 flex items-center justify-between mt-20">
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <LayoutDashboard className="h-10 w-10 text-blue-600 boreder " />
              Menus
            </h1>
          </div>
          <div className="relative">
            {filteredMenus.length < 0 ? (
              <Loader />
            ) : (
              <select
                defaultValue="system-management"
                className=" w-1/3 pl-4 pr-4 py-3 border rounded-3xl appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {filteredMenus.map((menu) => (
                  <option key={menu.id} value={menu.id}>
                    {menu.name}
                  </option>
                ))}
              </select>
            )}
            {/* Dropdown arrow icon */}
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"></div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <div className="mb-4 flex items-center space-x-4">
              <button
                onClick={expandAll}
                className="rounded-md bg-[#14161F] px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Collapse All
              </button>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Menu Tree - updated styling */}
            <div className="rounded-lg border bg-white p-6">
              {menuStatus === "loading" ? (
                <div className="flex justify-center py-4">
                  <Loader />
                </div>
              ) : (
                <div className="space-y-1">
                  {menus.map((menu) => renderMenuItem(menu))}
                </div>
              )}
            </div>

            {/* Menu Details - updated styling */}
            {selectedMenu && (
              <div className="rounded-lg  bg-white p-6">
                <h2 className="mb-4 text-lg font-medium">Menu Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Menu ID
                    </label>
                    <input
                      type="text"
                      value={selectedMenu.id}
                      disabled
                      className="mt-1 block w-full  border border-gray-200 bg-gray-50 p-3 text-gray-400 text-sm rounded-xl "
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Depth
                    </label>
                    <input
                      type="number"
                      value={selectedMenu.depth}
                      disabled
                      className="mt-1 block w-full  border border-gray-200 bg-gray-50 p-3 text-gray-400 text-sm rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Parent Data
                    </label>
                    <input
                      type="text"
                      value={selectedMenu.parentId || "Root"}
                      disabled
                      className="mt-1 block w-full  border border-gray-200 bg-gray-50 p-3 text-gray-400 text-sm rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      value={selectedMenu.name}
                      onChange={(e) =>
                        setSelectedMenu({
                          ...selectedMenu,
                          name: e.target.value,
                        })
                      }
                      className="mt-1 block w-full  border border-gray-200 bg-gray-50 p-3 text-gray-800 text-sm rounded-xl"
                    />
                  </div>
                  <button
                    onClick={saveMenuChanges}
                    disabled={menuStatus === "loading"}
                    className="mt-4 w-32 m-auto rounded-2xl bg-blue-600 px-10  py-2 text-lg font-medium text-white hover:bg-blue-700 text-center flex items-center justify-center"
                  >
                    {menuStatus === "loading" ? <Loader /> : "Save"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
