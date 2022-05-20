/*
 *  Copyright 2021 Collate
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package org.openmetada.restclient.model;


import javax.validation.constraints.NotEmpty;
import java.util.Set;

public class AuthorizerConfiguration {
  @NotEmpty private String className;
  @NotEmpty private String containerRequestFilter;
  @NotEmpty private Set<String> adminPrincipals;
  @NotEmpty private Set<String> botPrincipals;
  @NotEmpty private String principalDomain;

  @Override
  public String toString() {
    return "AuthorizerConfiguration{"
        + "className='"
        + className
        + '\''
        + ", containerRequestFilter='"
        + containerRequestFilter
        + '\''
        + '}';
  }

  public String getClassName() {
    return className;
  }

  public void setClassName(String className) {
    this.className = className;
  }

  public String getContainerRequestFilter() {
    return containerRequestFilter;
  }

  public void setContainerRequestFilter(String containerRequestFilter) {
    this.containerRequestFilter = containerRequestFilter;
  }

  public Set<String> getAdminPrincipals() {
    return adminPrincipals;
  }

  public void setAdminPrincipals(Set<String> adminPrincipals) {
    this.adminPrincipals = adminPrincipals;
  }

  public Set<String> getBotPrincipals() {
    return botPrincipals;
  }

  public void setBotPrincipals(Set<String> botPrincipals) {
    this.botPrincipals = botPrincipals;
  }

  public String getPrincipalDomain() {
    return principalDomain;
  }

  public void setPrincipalDomain(String principalDomain) {
    this.principalDomain = principalDomain;
  }
}
