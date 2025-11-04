# UnseenFutures: Verified Opportunity Platform for Marginalized African Graduates (SRS)

**Prepared by:** Deng Mayen Deng Akol  
**Institution:** African Leadership University (ALU)  
**Date:** 9/23/2025

---

## Table of Contents
1. Introduction
2. Overall Description
3. External Interface Requirements
4. Functional Requirements
5. Nonfunctional Requirements
6. Appendix

---

# 1. Introduction

## 1.1 Purpose
Create a platform where post-high school youth (Refugee, IDP, Vulnerable, PWD) can access opportunities and donors and NGOs can access verified beneficiaries using recommendation letters and field on-site verification.

## 1.2 Document Conventions
- Functional and non-functional requirements are enumerated.
- Verification status values: `Verified` / `Pending` / `Rejected`.

## 1.3 Intended Audience
- High school graduates looking for opportunities
- Donors and NGOs
- Platform administrators and developers

## 1.4 Product Scope
- Youth registration with category and profile data
- Admin + field verification workflow
- Donor search/filter system by category, country, camp/community
- Opportunity posting and application system
- Reporting dashboards for donors and youth

---

# 2. Overall Description

## 2.1 Product Perspective
- New, stand-alone platform to match post-high school youth with donors.
- Equity, inclusion, and transparency-oriented.

## 2.2 Product Functions
- User authentication and role-based access (youth, donor, admin)
- Youth profile creation with document + recommendation letter upload
- Admin and field verification of uploaded documents and recommendation letters
- Opportunity posting and application
- Search and filter youth by category, country, camp/community
- Dashboards and reporting for youth and donors

## 2.3 User Classes and Characteristics
- Youth: Apply for post-secondary opportunities, upload documents + recommendation letters
- Donors/NGOs: Post opportunities, search youth
- Admin: Check documents and recommendation letters, plan field verification
- Field Team: On-site verification, verify youth identity

## 2.4 Operating Environment
- Web browsers: Chrome, Edge, Firefox
- Backend: Flask/Node.js (MVP decision can be one of these)
- Database: SQLite/PostgreSQL

## 2.5 Design and Implementation Constraints
- MVP uses manual verification for recommendation letters and field verification
- Secure document and letter storage required
- Desktop and mobile responsive design

## 2.6 User Documentation
- Youth, donor, admin, and field team guides
- Verification and application FAQ

## 2.7 Assumptions and Dependencies
- Users have access to the internet
- Youth can upload valid documents + recommendation letters
- Field team can access camps/communities
- Donors/NGOs are registered on the platform

---

# 3. External Interface Requirements

## 3.1 User Interfaces
- Login/Register pages
- Youth profile creation with document + recommendation letter upload
- Field verification status update interface
- Donor search/filter page
- Opportunities feed and application page
- Dashboard pages for youth and donors

## 3.2 Hardware Interfaces
- PC, laptop, or smartphone

## 3.3 Software Interfaces
- Backend database (SQLite/PostgreSQL)
- Optional APIs for future document verification

## 3.4 Communication Interfaces
- Secure HTTPS for data transfer

---

# 4. Requirement Specification

## Stakeholder Requirements (Functional Requirements)

| Req ID | Requirement | Description |
|--------|-------------|-------------|
| FR1 | User registration and login | Graduates (high school or university) can register and login |
| FR2 | Youth profile creation with category | Include fields for category, country, camp/community |
| FR3 | Upload verification documents + recommendation letter | Users can upload ID, transcripts, and recommendation letters |
| FR4 | Admin verifies documents and recommendation letters | Admin reviews and approves users for verification |
| FR5 | Platform field team does on-site verification | Field team conducts verification when donor requests or as needed |
| FR6 | Donor search/filtering | Donors can search users by category, country, camp/community |
| FR7 | Post opportunities | Donors post scholarships, internships, vocational programs, mentorships |
| FR8 | Youth apply for opportunities | Apply button on opportunity posts for youth users |
| FR9 | Dashboard for tracking applications and verification status | Users can track application state and verification updates |

---

# 5. Other Nonfunctional Requirements

| Type | Req ID | Description |
|------|--------|-------------|
| Security | NFR1 | Secure login, HTTPS, role-based access control |
| Performance | NFR2 | Support ~50+ concurrent users for MVP; scale later as needed |
| Usability | NFR3 | Easy-to-use, simple interface; mobile-friendly |
| Reliability | NFR4 | Accurate display of verification status, including field verification |
| Technology | NFR5 | Runs on desktop and mobile browsers |

---

# 6. Appendix

## Appendix A: Glossary
- Youth: Refugee, IDP, Vulnerable, or PWD beneficiary who has graduated high school or university
- Donor: Individual or organization providing post-secondary opportunity or funding
- Verification: Procedure to verify authenticity of uploaded documents, letters of recommendation, and field verification

## Appendix B: Models and Diagrams (summary)
- Activity Diagram: Workflow from youth registration → profile/doc upload → admin review → optional field verification → access to opportunities → application → donor review → final status update on dashboard.
- Use Case Diagram: Actors (Youth, Donor/NGO, Admin, Field Team) and core use cases (register, upload, verify, post opportunity, apply, field verification).
- Class Diagram: Core entities: User (Youth, Donor, Admin, FieldAgent), Document, RecommendationLetter, Verification, FieldVisit, Opportunity, Application.
- Object Diagram: Example snapshot of a verified youth with documents and an application under review.

---

## Revision History

| Name | Date | Reason for Changes | Version |
|------|------|---------------------|---------|
| Deng Mayen Deng | 21/09/2025 | Initial draft created for Riseup Africa SRS (Sections 1–6 completed). | v1.0 |
| Deng Mayen Deng | 22/09/2025 | Updated Functional and Non-Functional Requirements after feedback. | v1.1 |
| Deng Mayen Deng | 23/09/2025 | Added Appendix (Glossary & Analysis Models) and Revision History. | v1.2 |
| Deng Mayen Deng | 25/09/2025 | Final submission version with formatting and references aligned to template. | v1.3 |

---

## References
- International Labour Organization. (2024). Global Employment Trends for Youth 2024: Sub-Saharan Africa. https://www.ilo.org/sites/default/files/2024-08/Sub-Saharan%20Africa%20GET%20Youth%202024_0.pdf
- World Bank. Unemployment, youth total (% of total labor force ages 15-24). https://data.worldbank.org/indicator/SL.UEM.1524.ZS?locations=ZG
- UNESCO Institute for Statistics. Education in Africa. https://uis.unesco.org/en/topic/education-africa
- Global Education Monitoring Report. (2025). Number of out-of-school children in Africa still on rise. https://www.developmentaid.org/news-stream/post/189893/out-of-school-children-in-africa-on-rise
- Global Partnership for Education. (2024). Making education in Africa fit for the 21st century. https://www.globalpartnership.org/blog/making-education-africa-fit-21st-century
- UNICEF Innocenti. (2024). Improving Education in Africa. https://www.unicef.org/innocenti/media/10126/file/UNICEF-Innocenti-Improving-Education-Africa-Brief-2024.pdf
- UNESCO Global Education Monitoring Report. (2025). Reaching the marginalized. https://www.unesco.org/gem-report/en/publication/reaching-marginalized
