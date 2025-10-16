import { defaultColors } from "@/utils/constants"

import { useState, ChangeEvent, useMemo } from "react"
import { useOptions } from "@/hooks/useOptions"

export default function ColorPicker(props: Props) {
  const { getOption } = useOptions()

  const [userColors, setUserColors] = useState([])
  const getUserColors = async () => {
    const userColors = await getOption("user_colors")
    setUserColors(userColors || []);
  };
  const availableColors = useMemo(() => {
    return [...userColors, ...defaultColors]
  }, [userColors])
}
