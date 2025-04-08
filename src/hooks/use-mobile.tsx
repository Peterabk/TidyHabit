
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState<boolean>(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }
    
    // Set initial value
    setMatches(mediaQuery.matches)
    
    // Add event listener
    mediaQuery.addEventListener("change", handleChange)
    
    // Clean up
    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [query])

  return matches
}

export function useIsMobile() {
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
}
