import type { ComponentProps } from "react"
import CountyMapPage from "./CountyMapPage"
import "./USA.css"

type Props = ComponentProps<typeof CountyMapPage>

export default function USA(props: Props) {
  return <CountyMapPage {...props} selectedCountyState={null} />
}
