// @whatmatters/wmds@0.2.0 · Pattern — dropdown row
// Storybook: Components/Avatar → Pattern — dropdown row (?path=/story/components-avatar--dropdown-row)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Avatar, Dropdown } from "@whatmatters/wmds";

export function AssigneeMenu() {
  return (
    <Dropdown.Menu role="listbox" aria-label="Assignee">
      <li role="presentation">
        <Dropdown.Item
          role="option"
          start={<Avatar name="Drew Young" size="sm" presence={{ tone: "success", label: "Online" }} />}
        >
          Drew Young
        </Dropdown.Item>
      </li>
    </Dropdown.Menu>
  );
}
