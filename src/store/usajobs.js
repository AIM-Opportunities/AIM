import { makeObservable, observable, action, computed } from "mobx";

class UsaJobs {
  jobs = "";
  constructor() {
    makeObservable(this, {
      jobs: observable,
      searchJobs: action,
      searchCodes: action,
    });
  }

  searchJobs = () => {
    const host = "data.usajobs.gov";
    const userAgent = "awadomar@gmail.address";
    const authKey = "8rz+Dg5/KDQH2uV4tdAoKjHksVwicpzrs8TODKPsC3Q=";

    fetch(
      "https://data.usajobs.gov/api/search?WhoMayApply=public&Keyword='Data Scientist",
      {
        method: "GET",
        headers: {
          Host: host,
          "User-Agent": userAgent,
          "Authorization-Key": authKey,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const searchResultItems = data.SearchResult.SearchResultItems;
        console.log(searchResultItems);
        const nameAndRemoteIndicator = searchResultItems.map((item) => {
          const name = item.MatchedObjectDescriptor.PositionTitle;
          const company = item.MatchedObjectDescriptor.OrganizationName;
          const department = item.MatchedObjectDescriptor.DepartmentName;
          const qualifications =
            item.MatchedObjectDescriptor.QualificationSummary;
          const category = item.MatchedObjectDescriptor.JobCategory[0].Name;
          const url = item.MatchedObjectDescriptor.PositionURI;

          console.log(name, category, company, url); // logs the "Name" field of the first item in the array
          return { name };
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  searchCodes = () => {
    const host = "data.usajobs.gov";
    const userAgent = "awadomar@gmail.address";
    const authKey = "8rz+Dg5/KDQH2uV4tdAoKjHksVwicpzrs8TODKPsC3Q=";

    fetch("https://data.usajobs.gov/api/codelist/agencysubelements", {
      method: "GET",
      headers: {
        Host: host,
        "User-Agent": userAgent,
        "Authorization-Key": authKey,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const validValues = data.CodeList[0].ValidValue;

        const codesAndNames = validValues.map((item) => {
          const code = item.Code;
          const name = item.Value;
          console.log(code, name); // logs the "Code" and "Value" fields of each item in the array
          return { code, name };
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
}
export const usajobsStore = new UsaJobs();
