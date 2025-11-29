import React, { Fragment, useEffect, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { menuList } from "@/utils/fackData/menuList";
import getIcon from "@/utils/getIcon";

const Menus = () => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [openSubDropdown, setOpenSubDropdown] = useState(null);
    const [activeParent, setActiveParent] = useState("");
    const [activeChild, setActiveChild] = useState("");
    const pathName = useLocation().pathname;

    const handleMainMenu = (e, name) => {
        if (openDropdown === name) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(name);
        }
    };

    const handleDropdownMenu = (e, name) => {
        e.stopPropagation();
        if (openSubDropdown === name) {
            setOpenSubDropdown(null);
        } else {
            setOpenSubDropdown(name);
        }
    };

    useEffect(() => {
    if (pathName) {
        const matchedMainItem = menuList.find((item) => {
            if (!Array.isArray(item.dropdownMenu)) {
                return item.path === pathName;
            } else {
                return item.dropdownMenu.some((sub) => sub.path === pathName);
            }
        });

        if (matchedMainItem) {
            setActiveParent(matchedMainItem.name);

            const matchedSub = matchedMainItem.dropdownMenu?.find(sub => sub.path === pathName);
            if (matchedSub) {
                setActiveChild(matchedSub.name);
                setOpenDropdown(matchedMainItem.name);
            } else {
                setActiveChild("");
                setOpenDropdown(null);
            }
        }
    }
}, [pathName]);


    return (
        <>
            {menuList.map(({ dropdownMenu, id, name, path, icon }) => {
                const isDropdown = Array.isArray(dropdownMenu);
                const isActive = activeParent === name;

                return (
                    <li
                        key={id}
                        onClick={(e) => {
                            if (isDropdown) handleMainMenu(e, name);
                        }}
                        className={`nxl-item ${isDropdown ? "nxl-hasmenu" : ""} ${isActive ? "active nxl-trigger" : ""}`}
                    >
                        <Link to={path} className="nxl-link text-capitalize">
                            <span className="nxl-micon"> {getIcon(icon)} </span>
                            <span className="nxl-mtext" style={{ paddingLeft: "2.5px" }}>
                                {name}
                            </span>
                            {isDropdown && (
                                <span className="nxl-arrow fs-16">
                                    <FiChevronRight />
                                </span>
                            )}
                        </Link>

                        {isDropdown && (
                            <ul className={`nxl-submenu ${openDropdown === name ? "nxl-menu-visible" : "nxl-menu-hidden"}`}>
                                {dropdownMenu.map(({ id, name, path, subdropdownMenu }) => {
                                    const hasSub = Array.isArray(subdropdownMenu) && subdropdownMenu.length > 0;
                                    const isChildActive = activeChild === name;

                                    return (
                                        <Fragment key={id}>
                                            {hasSub ? (
                                                <li
                                                    className={`nxl-item nxl-hasmenu ${isChildActive ? "active" : ""}`}
                                                    onClick={(e) => handleDropdownMenu(e, name)}
                                                >
                                                    <Link to={path} className="nxl-link text-capitalize">
                                                        <span className="nxl-mtext">{name}</span>
                                                        <span className="nxl-arrow">
                                                            <FiChevronRight />
                                                        </span>
                                                    </Link>

                                                    <ul
                                                        className={`nxl-submenu ${openSubDropdown === name
                                                            ? "nxl-menu-visible"
                                                            : "nxl-menu-hidden"
                                                            }`}
                                                    >
                                                        {subdropdownMenu.map(({ id, name, path }) => (
                                                            <li
                                                                key={id}
                                                                className={`nxl-item ${pathName === path ? "active" : ""}`}
                                                            >
                                                                <Link className="nxl-link text-capitalize" to={path}>
                                                                    {name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            ) : (
                                                <li
                                                    className={`nxl-item ${pathName === path ? "active" : ""}`}
                                                >
                                                    <Link className="nxl-link" to={path}>
                                                        {name}
                                                    </Link>
                                                </li>
                                            )}
                                        </Fragment>
                                    );
                                })}
                            </ul>
                        )}
                    </li>
                );
            })}

        </>
    );
};

export default Menus;
