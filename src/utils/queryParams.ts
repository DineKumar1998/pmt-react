import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { debounce } from "./methods";

/**
 * Preserves existing query parameters when navigating to a new URL
 * @param newUrl - The new URL or path to navigate to
 * @param currentSearchParams - The current search parameters from useSearchParams()
 * @param additionalParams - Any additional parameters to add to the URL
 * @returns A string URL with both existing and new parameters
 */
export function preserveQueryParams(
  newUrl: string,
  currentSearchParams: URLSearchParams,
  additionalParams: Record<string, string> = {}
): string {
  // Create a new URLSearchParams object from the current search params
  const preservedParams = new URLSearchParams(currentSearchParams.toString());
  
  // Add any additional parameters
  Object.entries(additionalParams).forEach(([key, value]) => {
    preservedParams.set(key, value);
  });
  
  // Construct the full URL with preserved parameters
  const separator = newUrl.includes('?') ? '&' : '?';
  const queryString = preservedParams.toString();
  
  return queryString ? `${newUrl}${separator}${queryString}` : newUrl;
}

/**
 * Custom hook that wraps useSearchParams and provides a navigation function
 * that automatically preserves query parameters
 */
export function usePreservedSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  /**
   * Navigates to a new URL while preserving existing query parameters
   * @param navigate - The navigate function from useNavigate()
   * @param newUrl - The new URL or path to navigate to
   * @param additionalParams - Any additional parameters to add to the URL
   * @param options - Navigation options (replace, state, etc.)
   */
  const navigateWithPreservedParams = (
    navigate: (to: string, options?: { replace?: boolean; state?: any }) => void,
    newUrl: string,
    additionalParams: Record<string, string> = {},
    options?: { replace?: boolean; state?: any }
  ) => {
    const urlWithParams = preserveQueryParams(newUrl, searchParams, additionalParams);
    navigate(urlWithParams, options);
  };
  
  return {
    searchParams,
    setSearchParams,
    navigateWithPreservedParams
  };
}

