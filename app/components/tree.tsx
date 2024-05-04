"use client"
import React, { useEffect, useState } from 'react';

interface TreeItem {
    id: number;
    name: string;
    designation: string;
    profilePic: string;
    p_id?: number;
    children?: TreeItem[];
}

interface State {
    level: number;
    selected: { level: number, data: TreeItem } | null;
}

const Tree: React.FC<{ data: TreeItem[] }> = ({ data }) => {
    const [print, setPrint] = useState<JSX.Element[] | null>(null);
    const [state, setState] = useState<State>({
        level: 0,
        selected: null,
    });
    const [activeLevel, setActiveLevel] = useState<any[]>([]);
    const [activeLevelD, setActiveLevelD] = useState<any[]>([]);

    function renameParentId(data: TreeItem[]): TreeItem[] {
        function modifyParentId(obj: TreeItem) {
            if (obj.children && obj.children.length > 0) {
                obj.children.forEach((child: TreeItem) => {
                    child.p_id = obj.id;
                    modifyParentId(child);
                });
            }
        }

        data.forEach((obj: TreeItem) => {
            modifyParentId(obj);
        });

        return data;
    }

    const modifieData = renameParentId(data.length ? data : []);

    const handleItemClick = (level: number, item: TreeItem) => {
        const index = activeLevelD.indexOf(level);
        console.log(index, level, item);
        if (index >= 0 && activeLevel.includes(item.id)) {
            activeLevelD.length = index;
            setActiveLevelD([...activeLevelD]);
            activeLevel.length = index;
            setActiveLevel([...activeLevel]);
        } else if (index >= 0) {
            activeLevel[index] = item.id;
            setActiveLevel([...activeLevel]);
        } else {
            activeLevel.push(item.id);
            activeLevelD.push(level);
            setActiveLevel([...activeLevel]);
        }
        if (state.selected && state.selected.level > (level + 1) && index >= 0) {
            console.log("aayaaaa...", print);
            const levels: JSX.Element[] = print ? print : [];
            if (levels) {
                levels.splice(level, levels.length - level + 1);
            }
            setPrint([...levels]);
        } else if (state.selected && state.selected.level === (level + 1) && state.selected.data.id === item.id) {
            console.log('updating state vlaue => ', state.selected.level);
            setState((prevState) => ({
                ...prevState,
                level: prevState.level - 1,
                selected: null,
            }));
        } else {
            setState((prevState) => ({
                ...prevState,
                level: level + 1,
                selected: { level: level + 1, data: item },
                [`${level + 1}_level`]: item,
            }));
        }
    };

    const renderNamesByLevel = () => {
        const levels: JSX.Element[] = [];
        console.log('selected level', state.level);
        if (state.level === 0) return;

        for (const key in state) {
            if (key.endsWith('_level')) {
                const level = parseInt(key.split('_')[0]);
                // @ts-ignore
                const items: TreeItem = state[key];
                console.log('looping level', level);
                if (level > state.level) {
                    break;
                }
                // @ts-ignore
                const names = items?.children?.map((item: TreeItem) => (
                    <div
                        className={`min-w-[240px] w-[240px] border h-14 flex items-center rounded-full px-2 gap-2 relative
                            ${activeLevel.includes(item.id) ? "border-indigo-600" : "border-gray-200"} ${item.children && item.children.length > 0 ? "cursor-pointer" : ""}`}
                        onClick={() => item.children && item.children.length > 0 ? handleItemClick(level, item) : false}
                        key={item.name}
                    >

                        <div className="w-10 h-10 bg-indigo-100 border border-indigo-600 text-indigo-600 rounded-full flex justify-center items-center">

                        </div>
                        <div className="flex flex-col text-sm">
                            <span>
                                {item.name}
                            </span>
                            <span className='w-[160px] truncate'>
                                {item.designation}
                            </span>
                        </div>
                        {item.children && item.children.length > 0 && <div className={`absolute p-1 -right-[2rem] w-[2rem] flex justify-center`}>
                            <span className={`relative z-10 px-1 bg-white border  ${activeLevel.includes(item.id) ? "border-indigo-600" : "border-gray-200"}`}>{item.children.length}</span>
                            <div className='w-[16px] h-[1px] left-0 top-[16px] bg-indigo-600 absolute z-[2px]' />
                            {activeLevel.includes(item.id) && <div className='w-[16px] h-[1px] right-0 top-[16px] bg-indigo-600 absolute z-[2px]' />}
                        </div>
                        }

                    </div>
                ));

                levels.push(
                    <div key={level} className={"flex flex-col gap-2"}>
                        {names}
                    </div>
                );
            }
        }
        setPrint(levels);
        return levels;
    };

    useEffect(() => {
        renderNamesByLevel();
    }, [state]);

    console.log(modifieData);

    return (
        <div className="flex gap-8 justify-start overflow-auto">
            {modifieData.map((item: TreeItem) => (
                <div
                    className={`min-w-[240px] w-[240px] border h-14 flex items-center rounded-full px-2 gap-2 relative
                        ${activeLevel.includes(item.id) ? "border-indigo-600" : "border-gray-200"} ${item.children && item.children.length > 0 ? "cursor-pointer" : ""}`}
                    onClick={() => item.children && item.children.length > 0 ? handleItemClick(0, item) : false}
                    key={item.name}
                >
                    <div className="w-10 h-10 bg-indigo-100 border border-indigo-600 text-indigo-600 rounded-full flex justify-center items-center">

                    </div>
                    <div className={"flex flex-col"}>
                        <span>{item.name}</span>
                        <span>{item.designation}</span>
                    </div>
                    {item.children && item.children.length > 0 && <div className={`absolute p-1 -right-[2rem] w-[2rem] flex justify-center`}>
                        <span className={`relative z-10 px-1 bg-white border  ${activeLevel.includes(item.id) ? "border-indigo-600" : "border-gray-200"}`}>{item.children.length}</span>
                        <div className='w-[16px] h-[1px] left-0 top-[16px] bg-indigo-600 absolute z-[2px]' />
                        {activeLevel.includes(item.id) && <div className='w-[16px] h-[1px] right-0 top-[16px] bg-indigo-600 absolute z-[2px]' />}
                    </div>
                    }
                </div>
            ))}
            {print}
        </div>
    );
};

export default Tree;
